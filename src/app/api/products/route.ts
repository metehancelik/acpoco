import { type NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import type { IProduct } from "@/models/Product";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";
import type { ShopifyVariant } from "@/utils/shopify";

const ITEMS_PER_PAGE = 24;

type DbVariant = {
	_id: { toString: () => string };
	productId: { toString: () => string };
	childSku: string;
	price: number;
	stock: number;
	attributes: { name: string; value: string }[];
};

function dbVariantToShopifyVariant(
	variant: DbVariant,
	firstImageUrl?: string,
): ShopifyVariant {
	const stock = variant.stock ?? 0;
	return {
		id: variant._id.toString(),
		title: variant.attributes.map((a) => a.value).join(" / "),
		price: variant.price.toString(),
		compareAtPrice: null,
		inventoryQuantity: stock,
		availableForSale: stock > 0,
		sku: variant.childSku,
		requiresShipping: true,
		taxable: true,
		selectedOptions: variant.attributes.map((a) => ({
			name: a.name,
			value: a.value,
		})),
		image: firstImageUrl
			? {
					id: `variant-${variant._id.toString()}`,
					url: firstImageUrl,
					altText: variant.attributes.map((a) => a.value).join(" / "),
					width: 800,
					height: 800,
				}
			: undefined,
	};
}

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = Math.max(1, Number(searchParams.get("page") ?? 1));
		const category = searchParams.get("category") ?? undefined;
		const query = searchParams.get("query") ?? undefined;

		await dbConnect();

		// biome-ignore lint/suspicious/noExplicitAny: mongoose filter
		const filter: Record<string, any> = {};
		if (category) {
			filter.category = category;
		}
		if (query?.trim()) {
			const regex = new RegExp(query.trim(), "i");
			filter.$or = [
				{ title: { $regex: regex } },
				{ parentSku: { $regex: regex } },
			];
		}

		const totalItems = await Product.countDocuments(filter);
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
		const hasNextPage = page < totalPages;
		const skip = (page - 1) * ITEMS_PER_PAGE;

		const products = await Product.find(filter)
			.populate("category")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(ITEMS_PER_PAGE)
			.lean();

		const productIds = products.map((p) => p._id);
		const variants = (await ProductVariantModel.find({
			productId: { $in: productIds },
		}).lean()) as DbVariant[];

		const variantsByProductId = new Map<string, DbVariant[]>();
		for (const v of variants) {
			const id = v.productId?.toString?.() ?? String(v.productId);
			if (!variantsByProductId.has(id)) {
				variantsByProductId.set(id, []);
			}
			variantsByProductId.get(id)!.push(v);
		}

		const productsWithVariants = (
			JSON.parse(JSON.stringify(products)) as IProduct[]
		).map((p: IProduct & { _id: string; images?: string[] }) => {
			const productIdStr = p._id?.toString?.() ?? String(p._id);
			const productVariants = variantsByProductId.get(productIdStr) ?? [];
			const firstImage = Array.isArray(p.images) ? p.images[0] : undefined;
			return {
				...p,
				shopifyData: {
					id: productIdStr,
					handle: p.parentSku ?? "",
					variants: productVariants.map((v) =>
						dbVariantToShopifyVariant(v, firstImage),
					),
					collections: [],
					status: "ACTIVE",
					createdAt: (p as unknown as { createdAt?: string }).createdAt ?? "",
					updatedAt: (p as unknown as { updatedAt?: string }).updatedAt ?? "",
				},
			};
		});

		const data: {
			products: IProduct[];
			hasNextPage: boolean;
			nextPage: number | null;
			page: number;
		} = {
			products: productsWithVariants,
			hasNextPage,
			nextPage: hasNextPage ? page + 1 : null,
			page,
		};

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{
				products: [],
				hasNextPage: false,
				nextPage: null,
				page: 1,
			},
			{ status: 500 },
		);
	}
}
