import axios from "axios";

import dbConnect from "@/lib/db";
import { DiscountModel, type IDiscount } from "@/models/Discount";
import Order from "@/models/Order";
import Product, { type IProduct } from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";
import Store, { type IStore } from "@/models/Store";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import WalletLog from "@/models/WalletLog";
import Warehouse from "@/models/Warehouse";
import { calculateDiscountedPrice } from "@/utils/discountCalculator";

import { getAmazonCustomizationFromOptions } from "./amazon-customization";
import type { ShipStationOrder } from "./types";

type ShipStationAuth = {
	apiKey: string;
	apiSecret: string;
};

function getShipStationAuth(): ShipStationAuth {
	const apiKey = process.env.SHIPSTATION_API_KEY;
	const apiSecret = process.env.SHIPSTATION_API_SECRET;

	if (!apiKey || !apiSecret) {
		throw new Error("ShipStation API key or secret is not configured");
	}

	return { apiKey, apiSecret };
}

function getShipStationAuthHeader(auth: ShipStationAuth): string {
	return `Basic ${Buffer.from(`${auth.apiKey}:${auth.apiSecret}`).toString("base64")}`;
}

export async function fetchShipStationOrders(userId?: string): Promise<{
	orders: ShipStationOrder[];
	products: Pick<IProduct, "parentSku" | "_id">[];
}> {
	try {
		await dbConnect();

		const auth = getShipStationAuth();

		const stores = await Store.find({ userId });
		const storeIds = stores.map((store) => store.storeId);

		const products = await Product.find({}, { _id: 1, sku: 1 });

		const orders = [];

		for (const storeId of storeIds) {
			const response = await axios(
				`https://ssapi.shipstation.com/orders?storeId=${storeId}`,
				{
					method: "GET",
					headers: {
						Authorization: getShipStationAuthHeader(auth),
						"Content-Type": "application/json",
					},
				},
			);
			const data = response.data;
			const pages: number = data.pages;
			orders.push(...data.orders);
			for (let i = 2; i <= pages; i++) {
				const response = await axios(
					`https://ssapi.shipstation.com/orders?storeId=${storeId}&page=${i}`,
					{
						method: "GET",
						headers: {
							Authorization: getShipStationAuthHeader(auth),
							"Content-Type": "application/json",
						},
					},
				);
				const data = response.data;
				orders.push(...data.orders);
			}
		}

		return { orders, products };
	} catch (error) {
		console.error("Error fetching ShipStation orders:", error);
		throw error;
	}
}

export async function syncOrderToDatabase(shipStationOrder: ShipStationOrder) {
	try {
		await dbConnect();

		const existing = await Order.findOne({ orderId: shipStationOrder.orderId });
		if (existing) {
			return existing;
		}

		const warehouse = await Warehouse.findOne({
			country: shipStationOrder.shipTo.country,
		});

		// Find the store to get the user
		const store = await Store.findOne({
			storeId: shipStationOrder.advancedOptions.storeId.storeId,
		});

		const user = store ? await User.findById(store.userId) : null;
		let warehousePrice = 0;

		if (warehouse) {
			warehousePrice = warehouse.price + (user?.warehousePriceRate ?? 0);
		}

		// Fetch all product variants with their products for SKU matching
		const allVariants = await ProductVariantModel.find({}).populate({
			path: "productId",
			select: "category",
		});

		// Build a SKU -> Variant map for fast lookup
		const skuToVariantMap = new Map<
			string,
			{
				_id: string;
				price: number;
				productId: { _id: string; category?: string };
			}
		>();
		for (const variant of allVariants) {
			if (variant.childSku) {
				skuToVariantMap.set(variant.childSku, {
					_id: variant._id.toString(),
					price: variant.price,
					productId: variant.productId as unknown as {
						_id: string;
						category?: string;
					},
				});
			}
		}

		// Fetch active discounts for this user (if user exists)
		let activeDiscounts: IDiscount[] = [];
		if (user) {
			activeDiscounts = (await DiscountModel.find({
				isActive: true,
			})) as unknown as IDiscount[];
		}

		// Process items with auto-matching
		const processedItems = await Promise.all(
			shipStationOrder.items
				.filter((item) => item.adjustment === false)
				.map(async (item) => {
					const { amazonCustomizationData, amazonCustomizationOptions } =
						await getAmazonCustomizationFromOptions(item.options);

					// Try to auto-match by SKU
					let matchId = null;
					let matchedPrice = null;

					if (item.sku) {
						const matchedVariant = skuToVariantMap.get(item.sku);
						if (matchedVariant && user) {
							matchId = matchedVariant._id;
							const basePrice = matchedVariant.price;

							// Calculate discounted price
							const categoryId =
								matchedVariant.productId?.category?.toString() || "";
							const { finalPrice } = calculateDiscountedPrice(
								basePrice,
								user._id.toString(),
								categoryId,
								matchedVariant._id.toString(),
								activeDiscounts,
							);

							matchedPrice = finalPrice;
						}
					}

					return {
						orderItemId: item.orderItemId,
						lineItemKey: item.lineItemKey,
						sku: item.sku,
						name: item.name,
						imageUrl: item.imageUrl,
						designUrl: null,
						quantity: item.quantity,
						unitPrice: item.unitPrice,
						taxAmount: item.taxAmount,
						weight: item.weight,
						shippingAmount: item.shippingAmount,
						options: item.options,
						amazonCustomizationData: amazonCustomizationData || null,
						amazonCustomizationOptions,
						productId: item.productId,
						adjustment: item.adjustment,
						warehouseLocation: item.warehouseLocation,
						upc: item.upc,
						createDate: item.createDate,
						modifyDate: item.modifyDate,
						matchId,
						matchedPrice,
					};
				}),
		);

		// Check if all items are matched
		const allItemsMatched = processedItems.every(
			(item) => item.matchId !== null,
		);

		// Determine initial status
		let orderStatus: "waitingMatch" | "waitingPayment" | "waitingProduction" =
			"waitingMatch";
		let isPayed = false;

		if (allItemsMatched) {
			orderStatus = "waitingPayment";

			// Try auto-payment if user exists and has sufficient balance
			if (user) {
				const userWallet = await Wallet.findOne({ userId: user._id });
				if (userWallet) {
					const totalPrice = processedItems.reduce((acc, item) => {
						return acc + (item.matchedPrice || 0) * item.quantity;
					}, 0);

					if (totalPrice > 0 && totalPrice <= userWallet.balance) {
						// Auto-pay: deduct balance
						await Wallet.updateOne(
							{ userId: user._id },
							{ $inc: { balance: -totalPrice } },
						);

						await WalletLog.create({
							userId: user._id,
							type: "WITHDRAW",
							info: "autoOrderPayment",
							changedBy: user._id,
							changeAmount: totalPrice,
							currentBalance: userWallet.balance,
							finalBalance: userWallet.balance - totalPrice,
						});

						orderStatus = "waitingProduction";
						isPayed = true;
					}
				}
			}
		}

		const orderData: any = {
			orderId: shipStationOrder.orderId,
			orderNumber: shipStationOrder.orderNumber,
			orderKey: shipStationOrder.orderKey,
			orderDate: shipStationOrder.orderDate,
			createDate: shipStationOrder.createDate,
			modifyDate: shipStationOrder.modifyDate,
			customerEmail: shipStationOrder.customerEmail,
			requestedShippingService: shipStationOrder.requestedShippingService,
			weight: shipStationOrder.weight,
			orderTotal: shipStationOrder.orderTotal,
			shippingAmount: shipStationOrder.shippingAmount,
			taxAmount: shipStationOrder.taxAmount,
			discountTotal: shipStationOrder.items.reduce(
				(total, item) => total + (item.adjustment ? item.unitPrice : 0),
				0,
			),
			amountPaid: shipStationOrder.amountPaid,
			customerId: shipStationOrder.customerId,
			shipDate: shipStationOrder.createDate,
			holdUntilDate: shipStationOrder.modifyDate,
			shipTo: shipStationOrder.shipTo,
			billTo: shipStationOrder.billTo,
			items: processedItems,
			paymentDate: shipStationOrder.paymentDate,
			shipByDate: shipStationOrder.shipByDate,
			orderStatus: shipStationOrder.orderStatus,
			customerUsername: shipStationOrder.customerUsername,
			customerNotes: shipStationOrder.customerNotes,
			internalNotes: shipStationOrder.internalNotes,
			gift: shipStationOrder.gift,
			giftMessage: shipStationOrder.giftMessage,
			paymentMethod: shipStationOrder.paymentMethod,
			carrierCode: shipStationOrder.carrierCode,
			serviceCode: shipStationOrder.serviceCode,
			packageCode: shipStationOrder.packageCode,
			confirmation: shipStationOrder.confirmation,
			dimensions: shipStationOrder.dimensions,
			insuranceOptions: {
				provider: shipStationOrder.insuranceOptions.provider,
				insureShipment: shipStationOrder.insuranceOptions.insureShipment,
				insuredValue: shipStationOrder.insuranceOptions.insuredValue,
			},
			internationalOptions: {
				contents: shipStationOrder.internationalOptions.contents,
				customsItems: shipStationOrder.internationalOptions.customsItems,
				nonDelivery: shipStationOrder.internationalOptions.nonDelivery,
			},
			advancedOptions: {
				warehouseId: shipStationOrder.advancedOptions.warehouseId,
				nonMachinable: shipStationOrder.advancedOptions.nonMachinable,
				saturdayDelivery: shipStationOrder.advancedOptions.saturdayDelivery,
				containsAlcohol: shipStationOrder.advancedOptions.containsAlcohol,
				mergedOrSplit: shipStationOrder.advancedOptions.mergedOrSplit,
				mergedIds: shipStationOrder.advancedOptions.mergedIds,
				parentId: shipStationOrder.advancedOptions.parentId,
				storeId: shipStationOrder.advancedOptions.storeId.storeId,
				customField1: shipStationOrder.advancedOptions.customField1,
				customField2: shipStationOrder.advancedOptions.customField2,
				customField3: shipStationOrder.advancedOptions.customField3,
				source: shipStationOrder.advancedOptions.source,
				billToParty: shipStationOrder.advancedOptions.billToParty,
				billToAccount: shipStationOrder.advancedOptions.billToAccount,
				billToPostalCode: shipStationOrder.advancedOptions.billToPostalCode,
				billToCountryCode: shipStationOrder.advancedOptions.billToCountryCode,
				billToMyOtherAccount:
					shipStationOrder.advancedOptions.billToMyOtherAccount,
			},
			tagIds: shipStationOrder.tagIds,
			externallyFulfilled: shipStationOrder.externallyFulfilled,
			externallyFulfilledBy: shipStationOrder.externallyFulfilledBy,
			externallyFulfilledById: shipStationOrder.externallyFulfilledById,
			externallyFulfilledByName: shipStationOrder.externallyFulfilledByName,
			labelMessages: shipStationOrder.labelMessages,
			isPayed,
			warehouse: shipStationOrder.shipTo.country, //order çekilirken warehouse değeri set ediliyor
			warehousePrice: warehousePrice,
			warehouseTrackingNumber: shipStationOrder.warehouseTrackingNumber || "",
			warehouseShippingService: shipStationOrder.warehouseShippingService || "",
			storeId: shipStationOrder.advancedOptions.storeId.storeId,
			status: orderStatus,
		};

		try {
			const created = new Order(orderData);
			return await created.save();
		} catch (error) {
			// If another sync created it concurrently, just return the existing record.
			const concurrent = await Order.findOne({
				orderId: shipStationOrder.orderId,
			});
			if (concurrent) return concurrent;
			throw error;
		}
	} catch (error) {
		console.error("Error syncing order to database:", error);
		throw error;
	}
}

export async function getStores(): Promise<IStore[]> {
	try {
		const auth = getShipStationAuth();

		const response = await axios("https://ssapi.shipstation.com/stores", {
			headers: {
				Authorization: getShipStationAuthHeader(auth),
				"Content-Type": "application/json",
			},
		});

		const data: IStore[] = response.data;

		return data.filter(
			(store) =>
				store.storeName !== "Api Shipments" &&
				store.storeName !== "Manual Orders",
		);
	} catch (error) {
		console.error("Error fetching ShipStation stores:", error);
		throw error;
	}
}

export async function fetchNewOrders(url: string): Promise<void> {
	await dbConnect();

	const auth = getShipStationAuth();

	// const products = await Product.find({}, { _id: 1, sku: 1 });

	try {
		const response = await axios(url, {
			headers: {
				Authorization: getShipStationAuthHeader(auth),
				"Content-Type": "application/json",
			},
		});
		for (const order of response.data.orders) {
			await syncOrderToDatabase(order);
		}
	} catch (error) {
		console.error("Error fetching new orders:", error);
		throw error;
	}
}

export async function fetchShipStationOrdersModifiedSince(options: {
	userId?: string;
	modifiedSince: Date;
}): Promise<{ orders: ShipStationOrder[]; storeIds: number[] }> {
	await dbConnect();

	const auth = getShipStationAuth();

	const stores = await Store.find(
		options.userId ? { userId: options.userId } : {},
	);
	const storeIds = stores.map((store) => store.storeId);
	const orders: ShipStationOrder[] = [];

	const sinceIso = options.modifiedSince.toISOString();
	const modifyDateStart = encodeURIComponent(sinceIso);
	const createDateStart = encodeURIComponent(sinceIso);

	for (const storeId of storeIds) {
		const commonParams = `storeId=${storeId}&pageSize=500&sortBy=ModifyDate&sortDir=DESC`;

		const fetchPaged = async (dateParam: string, dateValue: string) => {
			const baseUrl = `https://ssapi.shipstation.com/orders?${commonParams}&${dateParam}=${dateValue}`;
			const first = await axios(baseUrl, {
				method: "GET",
				headers: {
					Authorization: getShipStationAuthHeader(auth),
					"Content-Type": "application/json",
				},
			});

			const firstData = first.data as {
				orders?: ShipStationOrder[];
				pages?: number;
			};
			const batch = firstData.orders || [];
			orders.push(...batch);

			const pages = Number(firstData.pages || 1);
			for (let page = 2; page <= pages; page++) {
				const resp = await axios(`${baseUrl}&page=${page}`, {
					method: "GET",
					headers: {
						Authorization: getShipStationAuthHeader(auth),
						"Content-Type": "application/json",
					},
				});
				const data = resp.data as { orders?: ShipStationOrder[] };
				orders.push(...(data.orders || []));
			}

			return batch.length;
		};

		// Primary: orders modified since the timestamp
		const modifiedCount = await fetchPaged("modifyDateStart", modifyDateStart);

		// Fallback: pull by createDateStart for accounts where modifyDateStart is unreliable
		if (modifiedCount === 0) {
			await fetchPaged("createDateStart", createDateStart);
		}
	}

	return { orders, storeIds };
}

//TODO cron job to refresh store https://ssapi.shipstation.com/stores/refreshstore?storeId=storeId
export async function refreshStore(storeId: number): Promise<void> {
	try {
		const auth = getShipStationAuth();

		await axios.post(
			`https://ssapi.shipstation.com/stores/refreshstore?storeId=${storeId}`,
			{},
			{
				headers: {
					Authorization: getShipStationAuthHeader(auth),
					"Content-Type": "application/json",
				},
			},
		);
	} catch (error) {
		console.error(`Error refreshing store ${storeId}:`, error);
		throw error;
	}
}
