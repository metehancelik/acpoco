import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import Order from "@/models/Order";

import {
	extractCustomizationUrlFromOptions,
	fetchAmazonCustomizationData,
} from "./amazon-customization";

export interface AmazonCustomizationOption {
	label: string;
	option: string;
	priceDelta: number;
}

interface PriceDeltaObject {
	value?: number;
}

interface AmazonV3Area {
	label?: string;
	name?: string;
	optionValue?: string;
	text?: string;
	priceDelta?: number | PriceDeltaObject;
}

interface AmazonV3Surface {
	areas?: AmazonV3Area[];
}

interface AmazonV3Customization {
	customizationInfo?: {
		surfaces?: AmazonV3Surface[];
	};
}

type AmazonCustomizationDataMap = Record<string, unknown> & {
	"version3.0"?: AmazonV3Customization;
};

interface AmazonCustomizationDataResponse {
	customizationData?: AmazonCustomizationDataMap;
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
					const customizationData = (await fetchAmazonCustomizationData(
						customizationUrl,
					)) as AmazonCustomizationDataResponse | null;

					if (!customizationData) {
						errorCount++;
						continue;
					}

					// Version 3.0'dan özelleştirme seçeneklerini çıkar
					const options: AmazonCustomizationOption[] = [];

					const v3 = customizationData?.customizationData?.["version3.0"];
					if (v3?.customizationInfo?.surfaces) {
						const surfaces = v3.customizationInfo.surfaces;

						surfaces.forEach((surface) => {
							if (surface.areas) {
								surface.areas.forEach((area) => {
									const priceDeltaValue =
										typeof area.priceDelta === "number"
											? area.priceDelta
											: (area.priceDelta?.value ?? 0);
									const option: AmazonCustomizationOption = {
										label: area.label || area.name || "",
										option: area.optionValue || area.text || "",
										priceDelta: priceDeltaValue,
									};
									options.push(option);
								});
							}
						});
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
					logError(error);
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
		logError(error);
		throw error;
	}
}
