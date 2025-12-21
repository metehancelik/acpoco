import dbConnect from "@/lib/db";
import Order from "@/models/Order";

import {
	extractCustomizationUrlFromOptions,
	fetchAmazonCustomizationData,
} from "./amazon-customization";

export interface AmazonCustomizationOption {
	label: string;
	option: string;
	priceDelta: number;
	unit?: string;
}

type ProcessAmazonCustomizationsResult = {
	totalOrders: number;
	processedCount: number;
	skippedCount: number;
	errorCount: number;
};

export async function processAmazonCustomizationsForOrderIds(
	orderIds: number[],
): Promise<ProcessAmazonCustomizationsResult> {
	await dbConnect();

	if (!orderIds.length) {
		return {
			totalOrders: 0,
			processedCount: 0,
			skippedCount: 0,
			errorCount: 0,
		};
	}

	const amazonOrders = await Order.find({
		orderId: { $in: orderIds },
		"items.options": {
			$elemMatch: {
				name: "CustomizedURL",
			},
		},
	});

	let processedCount = 0;
	let skippedCount = 0;
	let errorCount = 0;

	for (const order of amazonOrders) {
		for (const item of order.items) {
			// Only fill missing customization fields; never overwrite existing data.
			if (item.amazonCustomizationData) {
				skippedCount++;
				continue;
			}

			const customizationUrl = extractCustomizationUrlFromOptions(item.options);
			if (!customizationUrl) {
				skippedCount++;
				continue;
			}

			try {
				const customizationData =
					await fetchAmazonCustomizationData(customizationUrl);
				if (!customizationData?.customizationData) {
					errorCount++;
					continue;
				}

				const options: AmazonCustomizationOption[] = [];

				const version3Data = customizationData.customizationData[
					"version3.0"
				] as
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
					for (const surface of version3Data.customizationInfo.surfaces) {
						if (!surface.areas) continue;
						for (const area of surface.areas) {
							options.push({
								label: area.label || area.name || "",
								option: area.optionValue || area.text || "",
								priceDelta: area.priceDelta?.value || 0,
								unit: area.unit || undefined,
							});
						}
					}
				}

				const res = await Order.updateOne(
					{ orderId: order.orderId },
					{
						$set: {
							"items.$[i].amazonCustomizationData":
								customizationData.customizationData,
							"items.$[i].amazonCustomizationOptions": options,
						},
					},
					{
						arrayFilters: [
							{
								"i.orderItemId": item.orderItemId,
								$or: [
									{ "i.amazonCustomizationData": { $exists: false } },
									{ "i.amazonCustomizationData": null },
								],
							},
						],
					},
				);

				if (res.modifiedCount > 0) processedCount++;
				else skippedCount++;

				// Rate limiting
				await new Promise((resolve) => setTimeout(resolve, 100));
			} catch (error) {
				console.error(`Error processing item ${item.sku}:`, error);
				errorCount++;
			}
		}
	}

	return {
		totalOrders: amazonOrders.length,
		processedCount,
		skippedCount,
		errorCount,
	};
}

export async function processAllAmazonCustomizations() {
	try {
		await dbConnect();

		// Tüm Amazon siparişlerini bul (CustomizedURL içeren siparişler)
		const amazonOrders = await Order.find({
			"items.options": {
				$elemMatch: {
					name: "CustomizedURL",
				},
			},
		});

		let processedCount = 0;
		let errorCount = 0;

		for (const order of amazonOrders) {
			for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
				const item = order.items[itemIndex];

				// CustomizedURL'yi kontrol et
				const customizationUrl = extractCustomizationUrlFromOptions(
					item.options,
				);

				if (!customizationUrl) {
					continue; // Bu item'da CustomizedURL yok, sonrakine geç
				}

				try {
					// Zip dosyasını indir ve JSON'u çıkar
					const customizationData =
						await fetchAmazonCustomizationData(customizationUrl);

					if (!customizationData) {
						errorCount++;
						continue;
					}

					// Version 3.0'dan özelleştirme seçeneklerini çıkar
					const options: AmazonCustomizationOption[] = [];

					const version3Data = customizationData.customizationData[
						"version3.0"
					] as
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
									options.push({
										label: area.label || area.name || "",
										option: area.optionValue || area.text || "",
										priceDelta: area.priceDelta?.value || 0,
										unit: area.unit || undefined,
									});
								}
							}
						}
					}

					// Veritabanını güncelle
					await Order.updateOne(
						{
							orderId: order.orderId,
							"items.orderItemId": item.orderItemId,
						},
						{
							$set: {
								"items.$.amazonCustomizationData":
									customizationData.customizationData,
								"items.$.amazonCustomizationOptions": options,
							},
						},
					);
					processedCount++;

					// Rate limiting - her istek arasında kısa bir bekleme
					await new Promise((resolve) => setTimeout(resolve, 100));
				} catch (error) {
					console.error(`    Error processing item ${item.sku}:`, error);
					errorCount++;
				}
			}
		}

		return {
			totalOrders: amazonOrders.length,
			processedCount,
			errorCount,
		};
	} catch (error) {
		console.error("Error processing Amazon customizations:", error);
		throw error;
	}
}
