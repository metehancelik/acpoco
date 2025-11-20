import { DeleteObjectCommand, S3, S3Client } from "@aws-sdk/client-s3";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

import { Order } from "@/models";

const s3Client = new S3({
	region: process.env.S3_REGION!,
	credentials: {
		accessKeyId: process.env.S3_ACCESS_KEY!,
		secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
	},
});

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
			Bucket: process.env.S3_BUCKET_NAME!,
			Key: uniqueFileName,
			Body: bodyBuffer,
			ContentType: "application/pdf",
			ContentDisposition: `attachment; filename="${uniqueFileName}"`,
		};

		await s3Client.putObject(params);

		// Generate the image URL
		const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${uniqueFileName}`;

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
	const s3 = new S3Client({
		region: process.env.S3_REGION!,
		credentials: {
			accessKeyId: process.env.S3_ACCESS_KEY!,
			secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
		},
	});
	const key = order.labelUrl.split("/").pop();
	const deleteParams = {
		Bucket: process.env.S3_BUCKET_NAME!,
		Key: key,
	};
	await s3.send(new DeleteObjectCommand(deleteParams));

	await Order.findByIdAndUpdate(id, { labelUrl: null });

	return Response.json({ success: true });
}
