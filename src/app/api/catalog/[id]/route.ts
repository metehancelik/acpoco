import { type NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import "@/models/Category";

import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

export async function GET(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		await dbConnect();

		const { id } = params;

		// Ürünü bul ve category bilgisini populate et
		// biome-ignore lint/suspicious/noExplicitAny: fix later
		const product: any = await Product.findById(id).populate("category").lean();

		if (!product) {
			return NextResponse.json(
				{
					success: false,
					error: "Ürün bulunamadı",
				},
				{ status: 404 },
			);
		}

		// Ürüne ait variant'ları çek
		// biome-ignore lint/suspicious/noExplicitAny: fix later
		const variants: any[] = await ProductVariantModel.find({
			productId: product._id,
		}).lean();

		// Shopify formatına dönüştür
		const shopifyFormattedProduct = {
			id: product._id.toString(),
			title: product.title,
			handle: product.parentSku,
			description: product.description,
			status: "ACTIVE",
			vendor: "ACPOCO",
			productType: product.category?.name || "Uncategorized",
			createdAt: product.createdAt,
			updatedAt: product.updatedAt,
			tags: [],
			totalInventory: variants.reduce((sum, v) => sum + (v.stock || 0), 0),
			onlineStoreUrl: "",
			images: {
				edges: product.images.map((url: string, index: number) => ({
					node: {
						id: `image-${index}`,
						url,
						altText: product.title,
						width: 800,
						height: 800,
					},
				})),
			},
			variants: {
				edges: variants.map((variant) => ({
					node: {
						id: variant._id.toString(),
						title: variant.attributes
							.map((attr: { name: string; value: string }) => attr.value)
							.join(" / "),
						price: variant.price.toString(),
						compareAtPrice: null,
						inventoryQuantity: variant.stock || 0,
						availableForSale: (variant.stock || 0) > 0,
						sku: variant.childSku,
						requiresShipping: true,
						taxable: true,
						selectedOptions: variant.attributes.map(
							(attr: { name: string; value: string }) => ({
								name: attr.name,
								value: attr.value,
							}),
						),
						image:
							product.images.length > 0
								? {
										id: `image-0`,
										url: product.images[0],
										altText: product.title,
										width: 800,
										height: 800,
									}
								: undefined,
					},
				})),
			},
			collections: {
				edges: product.category
					? [
							{
								node: {
									id: product.category._id.toString(),
									title: product.category.name,
									handle: product.category.name
										.toLowerCase()
										.replace(/\s+/g, "-"),
								},
							},
						]
					: [],
			},
			options: product.attributes.map(
				(attr: { name: string; values: string[] }, index: number) => ({
					id: `option-${index}`,
					name: attr.name,
					values: attr.values,
				}),
			),
			seo: {
				title: product.title,
				description: product.description,
			},
		};

		return NextResponse.json({
			success: true,
			data: shopifyFormattedProduct,
		});
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{
				success: false,
				error: "Ürün detayları getirilirken bir hata oluştu",
				details: error instanceof Error ? error.message : "Bilinmeyen hata",
			},
			{ status: 500 },
		);
	}
}
