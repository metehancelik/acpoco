import type { NextRequest } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import { deleteByPublicUrl, putObject } from "@/lib/objectStorage";
import type { ShipStationOrderItem } from "@/lib/shipstation/types";
import { Order } from "@/models";

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;
		const orderId = formData.get("orderId") as string;
		const orderItemId = formData.get("orderItemId") as string;

		if (!file) {
			return Response.json({ error: "No file uploaded" }, { status: 400 });
		}

		if (!orderId || !orderItemId) {
			return Response.json(
				{ error: "orderId and orderItemId are required" },
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

		const uniqueFileName = `${uuidv4()}.${fileExtension}`;
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

		const order = await Order.findById(orderId);
		if (!order) throw new Error("Order not found");

		const item = order.items.find(
			(item: ShipStationOrderItem) =>
				item.orderItemId.toString() === orderItemId.toString(),
		);

		if (!item) throw new Error("Item not found in order");

		item.designUrl = imageUrl;

		await order.save();

		return Response.json({ success: true, imageUrl });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}

export async function DELETE(request: NextRequest) {
	try {
		const formData = await request.formData();
		const orderId = formData.get("orderId") as string;
		const orderItemId = formData.get("orderItemId") as string;

		const order = await Order.findById(orderId);
		if (!order) {
			return Response.json({ error: "Order not found" }, { status: 404 });
		}

		const item = order.items.find(
			(item: ShipStationOrderItem) =>
				item.orderItemId.toString() === orderItemId.toString(),
		);

		if (!item) {
			return Response.json(
				{ error: "Item not found in order" },
				{ status: 404 },
			);
		}

		// If there's an existing image, delete it from S3
		if (item.designUrl) {
			await deleteByPublicUrl(item.designUrl);
		}

		// Clear the designUrl
		item.designUrl = null;
		await order.save();

		return Response.json({ success: true });
	} catch (error) {
		console.error("Error deleting image:", error);

		return Response.json({ error: "Failed to delete image" }, { status: 500 });
	}
}
