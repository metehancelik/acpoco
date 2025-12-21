import axios from "axios";

import dbConnect from "@/lib/db";
import Order from "@/models/Order";
import Product, { type IProduct } from "@/models/Product";
import Store, { type IStore } from "@/models/Store";
import User from "@/models/User";
import Warehouse from "@/models/Warehouse";

import {
	extractCustomizationUrlFromOptions,
	fetchAmazonCustomizationData,
	isAmazonCustomizationUrl,
} from "./amazon-customization";
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

		const user = await User.findOne({
			stores: { $in: [shipStationOrder.advancedOptions.storeId.storeId] },
		});
		let warehousePrice = 0;

		if (warehouse) {
			warehousePrice = warehouse.price + (user?.warehousePriceRate ?? 0);
		}

		const orderData: ShipStationOrder = {
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
			items: await Promise.all(
				shipStationOrder.items
					.filter((item) => item.adjustment === false)
					.map(async (item) => {
						// Amazon özelleştirme verilerini kontrol et
						const customizationUrl = extractCustomizationUrlFromOptions(
							item.options,
						);
						let amazonCustomizationData = null;
						const amazonCustomizationOptions: Array<{
							label: string;
							option: string;
							priceDelta: number;
							unit?: string;
						}> = [];

						if (
							customizationUrl &&
							isAmazonCustomizationUrl(customizationUrl)
						) {
							try {
								amazonCustomizationData =
									await fetchAmazonCustomizationData(customizationUrl);

								if (amazonCustomizationData?.customizationData) {
									// Version 3.0'dan özelleştirme seçeneklerini çıkar
									const version3Data = amazonCustomizationData
										.customizationData["version3.0"] as
										| {
												customizationInfo?: {
													surfaces?: Array<{
														areas?: Array<{
															label?: string;
															name?: string;
															optionValue?: string;
															text?: string;
															unit?: string;
															priceDelta?: { value?: number };
														}>;
													}>;
												};
										  }
										| undefined;

									if (version3Data?.customizationInfo?.surfaces) {
										const surfaces = version3Data.customizationInfo.surfaces;

										for (const surface of surfaces) {
											if (surface.areas) {
												for (const area of surface.areas) {
													amazonCustomizationOptions.push({
														label: area.label || area.name || "",
														option: area.optionValue || area.text || "",
														priceDelta: area.priceDelta?.value || 0,
														unit: area.unit || undefined,
													});
												}
											}
										}
									}
								}
							} catch (error) {
								console.error(
									`Error fetching Amazon customization data for item ${item.sku}:`,
									error,
								);
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
							amazonCustomizationData:
								amazonCustomizationData?.customizationData || null,
							amazonCustomizationOptions:
								amazonCustomizationOptions.length > 0
									? amazonCustomizationOptions
									: undefined,
							productId: item.productId,
							adjustment: item.adjustment,
							warehouseLocation: item.warehouseLocation,
							upc: item.upc,
							createDate: item.createDate,
							modifyDate: item.modifyDate,
							matchId: null,
							matchedPrice: null,
						};
					}),
			),
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
				storeId: shipStationOrder.advancedOptions.storeId,
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
			isPayed: false,
			warehouse: shipStationOrder.shipTo.country, //order çekilirken warehouse değeri set ediliyor
			warehousePrice: warehousePrice,
			warehouseTrackingNumber: shipStationOrder.warehouseTrackingNumber || "",
			warehouseShippingService: shipStationOrder.warehouseShippingService || "",
			storeId: shipStationOrder.advancedOptions.storeId.storeId,
			status: "waitingMatch",
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
