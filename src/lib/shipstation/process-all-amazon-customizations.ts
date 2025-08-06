import dbConnect from "@/lib/db";
import Order from "@/models/Order";

import {
  fetchAmazonCustomizationData,
  extractCustomizationUrlFromOptions,
} from "./amazon-customization";

export interface AmazonCustomizationOption {
  label: string;
  option: string;
  priceDelta: number;
}

export async function processAllAmazonCustomizations() {
  try {
    await dbConnect();

    console.log("Starting to process all Amazon customizations...");

    // Tüm Amazon siparişlerini bul (CustomizedURL içeren siparişler)
    const amazonOrders = await Order.find({
      "items.options": {
        $elemMatch: {
          name: "CustomizedURL",
        },
      },
    });

    console.log(
      `Found ${amazonOrders.length} Amazon orders with CustomizedURL`,
    );

    let processedCount = 0;
    let errorCount = 0;

    for (const order of amazonOrders) {
      console.log(`Processing order: ${order.orderId}`);

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
          console.log(`  Processing item ${itemIndex + 1} (${item.sku})`);

          // Zip dosyasını indir ve JSON'u çıkar
          const customizationData =
            await fetchAmazonCustomizationData(customizationUrl);

          if (!customizationData) {
            console.log(
              `    Failed to fetch customization data for item ${item.sku}`,
            );
            errorCount++;
            continue;
          }

          // Version 3.0'dan özelleştirme seçeneklerini çıkar
          const options: AmazonCustomizationOption[] = [];

          if (
            customizationData.customizationData["version3.0"]?.customizationInfo
              ?.surfaces
          ) {
            const surfaces =
              customizationData.customizationData["version3.0"]
                .customizationInfo.surfaces;

            surfaces.forEach((surface: any) => {
              if (surface.areas) {
                surface.areas.forEach((area: any) => {
                  const option: AmazonCustomizationOption = {
                    label: area.label || area.name || "",
                    option: area.optionValue || area.text || "",
                    priceDelta: area.priceDelta?.value || 0,
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

          console.log(
            `    Successfully processed item ${item.sku} with ${options.length} options`,
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

    console.log(`\n=== PROCESSING COMPLETE ===`);
    console.log(`Total orders processed: ${amazonOrders.length}`);
    console.log(`Items successfully processed: ${processedCount}`);
    console.log(`Items with errors: ${errorCount}`);

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
