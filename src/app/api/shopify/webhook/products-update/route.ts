import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { verifyAndParseShopifyWebhook } from "@/lib/shopify-webhook";
import { CategoryModel } from "@/models/Category";
import { LogModel } from "@/models/Logs";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

type ShopifyWebhookProductUpdate = {
  id: number;
  handle?: string;
  title?: string;
  body_html?: string | null;
  variants?: Array<{
    id: number;
    sku?: string;
    price?: string;
    option1?: string | null;
    option2?: string | null;
    option3?: string | null;
    inventory_quantity?: number;
  }>;
  options?: Array<{ name: string; values: string[] }>;
  images?: Array<{ src: string }>;
  image?: { src: string } | null;
};

export const POST = async (req: NextRequest) => {
  const verification =
    await verifyAndParseShopifyWebhook<ShopifyWebhookProductUpdate>(req);
  if (!verification.ok) {
    return NextResponse.json({ error: verification.reason }, { status: 401 });
  }

  await dbConnect();

  try {
    const payload = verification.json;
    const parentSku = payload.handle || String(payload.id);

    const images = (
      payload.images?.map((img) => img.src) ||
      (payload.image?.src ? [payload.image.src] : []) ||
      []
    ).filter(Boolean) as string[];

    const attributes = (payload.options || []).map((o) => ({
      name: o.name,
      values: o.values,
    }));

    const updates: Record<string, unknown> = {};
    if (payload.title !== undefined) updates.title = payload.title;
    if (payload.body_html !== undefined)
      updates.description = payload.body_html || "";
    if (images.length > 0) updates.images = images;
    if (attributes.length > 0) updates.attributes = attributes;

    // Ensure product has a category
    let defaultCategory = await CategoryModel.findOne({
      name: "Uncategorized",
    });
    if (!defaultCategory) {
      defaultCategory = await CategoryModel.create({
        name: "Uncategorized",
        image: "",
      });
    }
    updates.category = defaultCategory._id;

    // Update price from first variant if provided
    if (payload.variants && payload.variants[0]?.price) {
      updates.price = parseFloat(payload.variants[0].price as string);
    }

    let product = await Product.findOne({ parentSku });
    if (product) {
      product = await Product.findByIdAndUpdate(product._id, updates, {
        new: true,
      });
    }

    if (payload.variants && product) {
      const seenChildSkus = new Set<string>();
      for (const variant of payload.variants) {
        const childSku = variant.sku || String(variant.id);
        seenChildSkus.add(childSku);
        const variantAttributes = [
          variant.option1 ? { name: "Option1", value: variant.option1 } : null,
          variant.option2 ? { name: "Option2", value: variant.option2 } : null,
          variant.option3 ? { name: "Option3", value: variant.option3 } : null,
        ].filter(Boolean) as { name: string; value: string }[];

        const variantData = {
          productId: product._id,
          childSku,
          price: variant.price ? parseFloat(variant.price) : 0,
          attributes: variantAttributes,
          stock: variant.inventory_quantity || 0,
        };

        const existingVariant = await ProductVariantModel.findOne({ childSku });
        if (existingVariant) {
          await ProductVariantModel.findByIdAndUpdate(
            existingVariant._id,
            variantData,
            { new: true },
          );
        } else {
          await ProductVariantModel.create(variantData);
        }
      }

      // Optionally remove variants not present in update payload
      await ProductVariantModel.deleteMany({
        productId: product._id,
        childSku: { $nin: Array.from(seenChildSkus) },
      });
    }

    await LogModel.create({
      message: "Shopify webhook products-update processed",
      level: "info",
      meta: { productId: payload.id },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    await LogModel.create({
      message: "Shopify webhook products-update error",
      level: "error",
      meta: { error },
    });

    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
};
