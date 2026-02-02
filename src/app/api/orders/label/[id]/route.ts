import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { deleteByPublicUrl, putObject } from "@/lib/objectStorage";
import { Order } from "@/models";

export async function POST(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { id } = params;
	try {
		const formData = await request.formData();
		const file = formData.get("file") as File;

		if (!file) {
			return Response.json({ error: "No file uploaded" }, { status: 400 });
		}

		const fileExtension = file.name.split(".").pop()?.toLowerCase();
		const uniqueFileName = `${uuidv4()}.${fileExtension}`;
		const arrayBuffer = await file.arrayBuffer();
		const bodyBuffer = Buffer.from(arrayBuffer);

		const params = {
			key: uniqueFileName,
			body: bodyBuffer,
			contentType: "application/pdf",
			contentDisposition: `attachment; filename="${uniqueFileName}"`,
		};

		const { publicUrl: imageUrl } = await putObject(params);

		await Order.findByIdAndUpdate(id, { labelUrl: imageUrl });

		return Response.json({ success: true, imageUrl });
	} catch (error) {
		return Response.json({ error }, { status: 500 });
	}
}

export async function DELETE(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	const { id } = params;
	const order = await Order.findById(id);
	if (!order) {
		return Response.json({ error: "Order not found" }, { status: 404 });
	}
	if (!order.labelUrl) {
		return Response.json({ success: true });
	}
	await deleteByPublicUrl(order.labelUrl);

	await Order.findByIdAndUpdate(id, { labelUrl: null });

	return Response.json({ success: true });
}
