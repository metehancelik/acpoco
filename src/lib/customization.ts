import dbConnect from "@/lib/db";
import Order from "@/models/Order";

import { getAmazonCustomizationFromOptions } from "./amazon-customization";

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
				name: { $regex: "customized", $options: "i" },
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

			const { amazonCustomizationData, amazonCustomizationOptions } =
				await getAmazonCustomizationFromOptions(item.options);
			if (!amazonCustomizationData) {
				skippedCount++;
				continue;
			}

			try {
				const res = await Order.updateOne(
					{ orderId: order.orderId },
					{
						$set: {
							"items.$[i].amazonCustomizationData": amazonCustomizationData,
							"items.$[i].amazonCustomizationOptions":
								amazonCustomizationOptions || [],
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
					name: { $regex: "customized", $options: "i" },
				},
			},
		});

		let processedCount = 0;
		let errorCount = 0;

		for (const order of amazonOrders) {
			for (let itemIndex = 0; itemIndex < order.items.length; itemIndex++) {
				const item = order.items[itemIndex];

				try {
					const { amazonCustomizationData, amazonCustomizationOptions } =
						await getAmazonCustomizationFromOptions(item.options);
					if (!amazonCustomizationData) {
						errorCount++;
						continue;
					}

					// Veritabanını güncelle
					await Order.updateOne(
						{
							orderId: order.orderId,
							"items.orderItemId": item.orderItemId,
						},
						{
							$set: {
								"items.$.amazonCustomizationData": amazonCustomizationData,
								"items.$.amazonCustomizationOptions":
									amazonCustomizationOptions || [],
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
