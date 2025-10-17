import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { verifyAndParseShopifyWebhook } from "@/lib/shopify-webhook";
import { LogModel } from "@/models/Logs";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

type ShopifyWebhookProductDelete = {
  id: number;
  handle?: string;
};

export const POST = async (req: NextRequest) => {
  const verification =
    await verifyAndParseShopifyWebhook<ShopifyWebhookProductDelete>(req);
  if (!verification.ok) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  await dbConnect();

  try {
    const payload = verification.json;
    const parentSku = payload.handle || String(payload.id);

    const product = await Product.findOne({ parentSku });
    if (product) {
      await ProductVariantModel.deleteMany({ productId: product._id });
      await Product.findByIdAndDelete(product._id);
    }

    await LogModel.create({
      message: "Shopify webhook products-delete processed",
      level: "info",
      meta: { productId: payload.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    await LogModel.create({
      message: "Shopify webhook products-delete error",
      level: "error",
      meta: { error },
    });

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
};
