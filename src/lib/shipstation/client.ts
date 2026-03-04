import axios from "axios";

import dbConnect from "@/lib/db";
import { adjustInventoryBySku } from "@/lib/shopify";
import { DiscountModel, type IDiscount } from "@/models/Discount";
import { LogModel } from "@/models/Logs";
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

/**
 * Fetches ShipStation orders for the user's stores.
 * StoreId: we set order.storeId = storeId for every order (see docs/SHIPSTATION_ORDER_SYNC.md).
 */
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

		const orders: ShipStationOrder[] = [];

		const pageSize = 500;
		const sortParams = "sortBy=CreateDate&sortDir=DESC"; // newest first so latest order is on page 1

		for (const storeId of storeIds) {
			const baseUrl = `https://ssapi.shipstation.com/orders?storeId=${storeId}&pageSize=${pageSize}&${sortParams}`;
			const response = await axios(baseUrl, {
				method: "GET",
				headers: {
					Authorization: getShipStationAuthHeader(auth),
					"Content-Type": "application/json",
				},
			});
			const data = response.data as {
				orders?: ShipStationOrder[];
				pages?: number;
			};
			const batch = data.orders ?? [];
			for (const o of batch) {
				// Required: set storeId from fetch context (API often omits/invalid for eBay/Amazon)
				(o as { storeId?: number }).storeId = storeId;
				orders.push(o);
			}
			const pages = Number(data.pages ?? 1);
			for (let i = 2; i <= pages; i++) {
				const pageResp = await axios(`${baseUrl}&page=${i}`, {
					method: "GET",
					headers: {
						Authorization: getShipStationAuthHeader(auth),
						"Content-Type": "application/json",
					},
				});
				const pageData = pageResp.data as { orders?: ShipStationOrder[] };
				for (const o of pageData.orders ?? []) {
					(o as { storeId?: number }).storeId = storeId;
					orders.push(o);
				}
			}
		}

		return { orders, products };
	} catch (error) {
		console.error("Error fetching ShipStation orders:", error);
		throw error;
	}
}

/**
 * Processes auto-matching and auto-payment for existing orders.
 * Called when an existing order is in waitingMatch or waitingPayment status.
 */
async function processOrderAutoMatchAndPayment(
	// biome-ignore lint/suspicious/noExplicitAny: mongoose document
	existingOrder: any,
	resolvedStoreId?: number,
) {
	try {
		// Find the store to get the user
		const store =
			resolvedStoreId != null
				? await Store.findOne({ storeId: resolvedStoreId })
				: existingOrder.storeId
					? await Store.findOne({ storeId: existingOrder.storeId })
					: await Store.findOne({
							storeId: existingOrder.advancedOptions?.storeId,
						});

		if (!store) return;

		const user = await User.findById(store.userId);
		if (!user) return;

		// Fetch all product variants for SKU matching
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
				childSku: string;
				productId: { _id: string; category?: string };
			}
		>();
		for (const variant of allVariants) {
			if (variant.childSku) {
				skuToVariantMap.set(variant.childSku, {
					_id: variant._id.toString(),
					price: variant.price,
					childSku: variant.childSku,
					productId: variant.productId as unknown as {
						_id: string;
						category?: string;
					},
				});
			}
		}

		// Fetch active discounts for this user
		const activeDiscounts = (await DiscountModel.find({
			isActive: true,
		})) as unknown as IDiscount[];

		let needsUpdate = false;
		let allItemsMatched = true;

		// Process items - try to match unmatched items
		for (const item of existingOrder.items) {
			if (!item.matchId && item.sku) {
				const matchedVariant = skuToVariantMap.get(item.sku);
				if (matchedVariant) {
					item.matchId = matchedVariant._id;
					const basePrice = matchedVariant.price;

					// Calculate discounted price (scope.productId is Product _id, not variant)
					const categoryId =
						matchedVariant.productId?.category?.toString() || "";
					const productId = matchedVariant.productId?._id?.toString() || "";
					const { finalPrice } = calculateDiscountedPrice(
						basePrice,
						user._id.toString(),
						categoryId,
						productId,
						activeDiscounts,
					);

					item.matchedPrice = finalPrice;
					needsUpdate = true;
				}
			}

			if (!item.matchId) {
				allItemsMatched = false;
			}
		}

		// Update status based on matching
		if (existingOrder.status === "waitingMatch" && allItemsMatched) {
			existingOrder.status = "waitingPayment";
			needsUpdate = true;
		}

		// Try auto-payment if all items are matched and order is waiting for payment
		if (
			allItemsMatched &&
			(existingOrder.status === "waitingPayment" ||
				existingOrder.status === "waitingMatch") &&
			!existingOrder.isPayed
		) {
			const userWallet = await Wallet.findOne({ userId: user._id });
			if (userWallet) {
				const totalPrice = existingOrder.items.reduce(
					// biome-ignore lint/suspicious/noExplicitAny: mongoose item
					(acc: number, item: any) => {
						return acc + (item.matchedPrice || 0) * (item.quantity || 0);
					},
					0,
				);

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

					existingOrder.status = "waitingProduction";
					existingOrder.isPayed = true;
					needsUpdate = true;

					// Adjust Shopify inventory for matched variants
					try {
						const inventoryResults = await Promise.all(
							// biome-ignore lint/suspicious/noExplicitAny: mongoose item
							existingOrder.items.map(async (item: any) => {
								const childSku = item.sku;
								const quantity = item.quantity || 0;
								if (!childSku || !quantity || !item.matchId) return null;
								const res = await adjustInventoryBySku(childSku, -quantity);
								if (res.ok) {
									await ProductVariantModel.updateOne(
										{ childSku, stock: { $gte: quantity } },
										{ $inc: { stock: -quantity } },
									);
								}
								return { sku: childSku, quantity, ...res };
							}),
						);
						const failures = (inventoryResults || []).filter(
							(r) => r && r.ok === false,
						);
						if (failures.length > 0) {
							await LogModel.create({
								message:
									"Shopify inventory adjust failed for some items (auto-payment existing order)",
								level: "warn",
								meta: { orderId: existingOrder.orderId, failures },
							});
						}
					} catch (err) {
						await LogModel.create({
							message:
								"Shopify inventory adjust error (auto-payment existing order)",
							level: "error",
							meta: {
								orderId: existingOrder.orderId,
								error: (err as Error).message,
							},
						});
					}
				}
			}
		}

		// Save changes if needed
		if (needsUpdate) {
			await existingOrder.save();
		}
	} catch (error) {
		console.error(
			"Error processing auto-match and payment for existing order:",
			error,
		);
		// Don't throw - we don't want to break the sync for existing orders
	}
}

/**
 * Syncs a ShipStation order to the DB. Resolves and persists storeId (see docs/SHIPSTATION_ORDER_SYNC.md).
 * Backfills storeId on existing orders via Order.updateOne so it persists.
 */
export async function syncOrderToDatabase(shipStationOrder: ShipStationOrder) {
	try {
		await dbConnect();

		// Resolve storeId: prefer value set during fetch, else API (advancedOptions.storeId number or .storeId)
		const fromApi =
			typeof shipStationOrder.advancedOptions?.storeId === "number"
				? shipStationOrder.advancedOptions.storeId
				: shipStationOrder.advancedOptions?.storeId?.storeId;
		const raw = (shipStationOrder as { storeId?: number }).storeId ?? fromApi;
		const resolvedStoreId =
			typeof raw === "number" && Number.isFinite(raw) && raw > 0
				? raw
				: undefined;

		const existing = await Order.findOne({ orderId: shipStationOrder.orderId });
		if (existing) {
			// Backfill storeId when missing (use updateOne so it persists; save() can drop new schema fields)
			const needsStoreId =
				resolvedStoreId != null &&
				(existing.storeId == null ||
					existing.storeId === "" ||
					!Number.isFinite(Number(existing.storeId)));
			if (needsStoreId) {
				await Order.updateOne(
					{ orderId: shipStationOrder.orderId },
					{
						$set: {
							storeId: resolvedStoreId,
							"advancedOptions.storeId": resolvedStoreId,
						},
					},
				);
			}

			// Process auto-matching and auto-payment for existing orders in waitingMatch or waitingPayment status
			if (
				existing.status === "waitingMatch" ||
				existing.status === "waitingPayment"
			) {
				await processOrderAutoMatchAndPayment(existing, resolvedStoreId);
			}

			return existing;
		}

		// Normalize item weight: ShipStation may send { value, units, WeightUnits } but schema expects Number
		const normalizeItemWeight = (w: unknown): number | undefined => {
			if (w == null) return undefined;
			if (typeof w === "number" && Number.isFinite(w)) return w;
			if (typeof w === "object" && "value" in (w as object)) {
				const v = (w as { value?: unknown }).value;
				if (typeof v === "number" && Number.isFinite(v)) return v;
			}
			return undefined;
		};

		const warehouse = await Warehouse.findOne({
			country: shipStationOrder.shipTo.country,
		});

		// Find the store to get the user
		const store =
			resolvedStoreId != null
				? await Store.findOne({ storeId: resolvedStoreId })
				: null;

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

							// Calculate discounted price (scope.productId is Product _id, not variant)
							const categoryId =
								matchedVariant.productId?.category?.toString() || "";
							const productId = matchedVariant.productId?._id?.toString() || "";
							const { finalPrice } = calculateDiscountedPrice(
								basePrice,
								user._id.toString(),
								categoryId,
								productId,
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
						weight: normalizeItemWeight(item.weight),
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

						// Adjust Shopify inventory for matched variants (same as manual payment)
						try {
							const inventoryResults = await Promise.all(
								processedItems.map(async (item) => {
									const matchedVariant = item.matchId
										? skuToVariantMap.get(item.sku || "")
										: null;
									const childSku = item.sku;
									const quantity = item.quantity || 0;
									if (!childSku || !quantity || !matchedVariant) return null;
									const res = await adjustInventoryBySku(childSku, -quantity);
									if (res.ok) {
										await ProductVariantModel.updateOne(
											{ childSku, stock: { $gte: quantity } },
											{ $inc: { stock: -quantity } },
										);
									}
									return { sku: childSku, quantity, ...res };
								}),
							);
							const failures = (inventoryResults || []).filter(
								(r) => r && r.ok === false,
							);
							if (failures.length > 0) {
								await LogModel.create({
									message:
										"Shopify inventory adjust failed for some items (auto-payment)",
									level: "warn",
									meta: { orderId: shipStationOrder.orderId, failures },
								});
							}
						} catch (err) {
							await LogModel.create({
								message: "Shopify inventory adjust error (auto-payment)",
								level: "error",
								meta: {
									orderId: shipStationOrder.orderId,
									error: (err as Error).message,
								},
							});
						}
					}
				}
			}
		}

		const orderData: Record<string, unknown> = {
			orderId: shipStationOrder.orderId,
			orderNumber: shipStationOrder.orderNumber,
			orderKey: shipStationOrder.orderKey,
			orderDate: shipStationOrder.orderDate,
			createDate: shipStationOrder.createDate,
			modifyDate: shipStationOrder.modifyDate,
			customerEmail: shipStationOrder.customerEmail ?? "",
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
				warehouseId: shipStationOrder.advancedOptions?.warehouseId,
				nonMachinable: shipStationOrder.advancedOptions?.nonMachinable,
				saturdayDelivery: shipStationOrder.advancedOptions?.saturdayDelivery,
				containsAlcohol: shipStationOrder.advancedOptions?.containsAlcohol,
				mergedOrSplit: shipStationOrder.advancedOptions?.mergedOrSplit,
				mergedIds: shipStationOrder.advancedOptions?.mergedIds ?? [],
				parentId: shipStationOrder.advancedOptions?.parentId,
				storeId: resolvedStoreId,
				customField1: shipStationOrder.advancedOptions?.customField1,
				customField2: shipStationOrder.advancedOptions?.customField2,
				customField3: shipStationOrder.advancedOptions?.customField3,
				source: shipStationOrder.advancedOptions?.source,
				billToParty: shipStationOrder.advancedOptions?.billToParty,
				billToAccount: shipStationOrder.advancedOptions?.billToAccount,
				billToPostalCode: shipStationOrder.advancedOptions?.billToPostalCode,
				billToCountryCode: shipStationOrder.advancedOptions?.billToCountryCode,
				billToMyOtherAccount:
					shipStationOrder.advancedOptions?.billToMyOtherAccount,
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
			storeId: resolvedStoreId,
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

/**
 * Fetches orders modified/created since a date (cron). Sets order.storeId per store (see docs/SHIPSTATION_ORDER_SYNC.md).
 */
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

	const sinceIso = options.modifiedSince.toISOString();
	const modifyDateStart = encodeURIComponent(sinceIso);
	const createDateStart = encodeURIComponent(sinceIso);

	// Dedupe by orderId so we can fetch both modifyDate and createDate without duplicates
	const orderMap = new Map<number, ShipStationOrder>();

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
			for (const order of batch) {
				(order as { storeId?: number }).storeId = storeId;
				orderMap.set(order.orderId, order);
			}

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
				for (const order of data.orders || []) {
					(order as { storeId?: number }).storeId = storeId;
					orderMap.set(order.orderId, order);
				}
			}

			return batch.length;
		};

		// Fetch orders modified since timestamp (catches updates to existing orders)
		await fetchPaged("modifyDateStart", modifyDateStart);

		// Always also fetch by createDate so we don't miss new orders whose modifyDate is still old
		await fetchPaged("createDateStart", createDateStart);
	}

	return { orders: Array.from(orderMap.values()), storeIds };
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
