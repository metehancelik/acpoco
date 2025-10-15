import { S3 } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import sharp from "sharp";
import { v4 as uuidv4 } from "uuid";

import { Order } from "@/models";

const s3Client = new S3({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

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
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: uniqueFileName,
      Body: optimizedBuffer,
      ContentType: contentType,
    };

    await s3Client.putObject(params);

    // Generate the image URL
    const imageUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com/${uniqueFileName}`;

    // Only update order if it's an order upload
    if (uploadType === "order" && orderId && orderItemId) {
      await Order.findByIdAndUpdate(orderId, {
        [`items.${orderItemId}.imageUrl`]: imageUrl,
      });
    }

    return Response.json({ success: true, imageUrl });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
