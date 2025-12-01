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
