import { type NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { verifyAndParseShopifyWebhook } from "@/lib/shopify-webhook";
import { CategoryModel } from "@/models/Category";
import { LogModel } from "@/models/Logs";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

type ShopifyWebhookProduct = {
	id: number;
	handle?: string;
	title: string;
	body_html?: string;
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
	product_type?: string;
	vendor?: string;
};

export const POST = async (req: NextRequest) => {
	const verification =
		await verifyAndParseShopifyWebhook<ShopifyWebhookProduct>(req);

	if (!verification.ok) {
		return NextResponse.json({ error: verification.reason }, { status: 401 });
	}

	await dbConnect();

	try {
		const payload = verification.json;

		// Ensure default category exists
		let defaultCategory = await CategoryModel.findOne({
			name: "Uncategorized",
		});
		if (!defaultCategory) {
			defaultCategory = await CategoryModel.create({
				name: "Uncategorized",
				image: "",
			});
		}

		const images = (
			payload.images?.map((img) => img.src) ||
			(payload.image?.src ? [payload.image.src] : []) ||
			[]
		).filter(Boolean) as string[];

		const attributes = (payload.options || []).map((o) => ({
			name: o.name,
			values: o.values,
		}));

		const firstVariantPrice = payload.variants?.[0]?.price
			? parseFloat(payload.variants[0].price as string)
			: 0;

		const productData = {
			parentSku: payload.handle || String(payload.id),
			title: payload.title,
			price: firstVariantPrice,
			description: payload.body_html || "",
			weight: { value: 0, unit: "kg" },
			dimensions: { length: 0, width: 0, height: 0, unit: "cm" },
			images,
			attributes,
			category: defaultCategory._id,
		};

		let existing = await Product.findOne({ parentSku: productData.parentSku });
		if (existing) {
			existing = await Product.findByIdAndUpdate(existing._id, productData, {
				new: true,
			});
		} else {
			existing = await Product.create(productData);
		}

		if (payload.variants && existing) {
			for (const variant of payload.variants) {
				const childSku = variant.sku || String(variant.id);
				const variantAttributes = [
					variant.option1 ? { name: "Option1", value: variant.option1 } : null,
					variant.option2 ? { name: "Option2", value: variant.option2 } : null,
					variant.option3 ? { name: "Option3", value: variant.option3 } : null,
				].filter(Boolean) as { name: string; value: string }[];

				const variantData = {
					productId: existing._id,
					childSku,
					price: variant.price ? parseFloat(variant.price) : 0,
					attributes: variantAttributes,
					stock: variant.inventory_quantity || 0,
				};

				const existingVariant = await ProductVariantModel.findOne({
					childSku,
				});
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
		}

		await LogModel.create({
			message: "Shopify webhook products-create processed",
			level: "info",
			meta: { productId: payload.id },
		});

		return NextResponse.json({ ok: true });
	} catch (error) {
		await LogModel.create({
			message: "Shopify webhook products-create error",
			level: "error",
			meta: { error },
		});

		return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
	}
};
