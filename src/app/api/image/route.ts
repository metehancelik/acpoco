import type { NextRequest } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import { putObject } from "@/lib/objectStorage";
import { Order } from "@/models";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const uploadType = formData.get("uploadType") as string; // "order" or "product"
		const orderId = formData.get("orderId") as string;
		const orderItemId = formData.get("orderItemId") as string;

		if (!file) {
			return Response.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Only require order fields for order uploads
		if (uploadType === "order" && (!orderId || !orderItemId)) {
			return Response.json(
				{ error: "orderId and orderItemId are required for order uploads" },
				{ status: 400 },
			);
		}

		const fileExtension = file.name.split(".").pop()?.toLowerCase();

		// Validate supported formats
		if (!fileExtension || !["jpg", "jpeg", "png"].includes(fileExtension)) {
			return Response.json(
				{ error: "Only JPEG and PNG formats are supported" },
				{ status: 400 },
			);
		}

		const uniqueFileName = `${uploadType || "general"}/${uuidv4()}.${fileExtension}`;
		const buffer = await file.arrayBuffer();

		// Create Sharp instance with resize
		const sharpInstance = sharp(Buffer.from(buffer)).resize(1200, 1200, {
			fit: "inside",
			withoutEnlargement: true,
		});

		// Apply format-specific optimization
		let optimizedBuffer: Buffer;
		let contentType: string;

		if (fileExtension === "png") {
			optimizedBuffer = await sharpInstance
				.png({ quality: 80, compressionLevel: 6 })
				.toBuffer();
			contentType = "image/png";
		} else {
			// For jpg/jpeg
			optimizedBuffer = await sharpInstance.jpeg({ quality: 80 }).toBuffer();
			contentType = "image/jpeg";
		}

		const params = {
			key: uniqueFileName,
			body: optimizedBuffer,
			contentType,
		};

		const { publicUrl: imageUrl } = await putObject(params);

		// Only update order if it's an order upload
		if (uploadType === "order" && orderId && orderItemId) {
			await Order.findByIdAndUpdate(orderId, {
				[`items.${orderItemId}.imageUrl`]: imageUrl,
			});
		}

		return Response.json({ success: true, imageUrl });
	} catch (error) {
		console.error("Error uploading image:", error);
		const message = error instanceof Error ? error.message : String(error);
		return Response.json({ error: message }, { status: 500 });
	}
}
