import ShopifyProductClient from "@/components/product-details/ShopifyProductClient";
import dbConnect from "@/lib/db";
import Product, { type IProduct } from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";
import type { ShopifyProduct, ShopifyVariant } from "@/utils/shopify";

type DbProduct = IProduct & {
	_id: { toString: () => string };
	createdAt: string;
	updatedAt: string;
	category?: {
		_id: { toString: () => string };
		name: string;
	};
};

type DbVariant = {
	_id: { toString: () => string };
	productId: string;
	childSku: string;
	price: number;
	stock: number;
	attributes: { name: string; value: string }[];
};

const ProductPage = async ({
	params: { id },
	searchParams,
}: {
	params: { id: string };
	searchParams: { [key: string]: string | string[] | undefined };
}) => {
	let product: ShopifyProduct | null;

	try {
		await dbConnect();

		const dbProduct = (await Product.findById(id)
			.populate("category")
			.lean()) as DbProduct | null;

		if (!dbProduct) {
			throw new Error("Product not found");
		}

		const variants = (await ProductVariantModel.find({
			productId: dbProduct._id,
		}).lean()) as DbVariant[];

		// Convert to Shopify format
		product = {
			id: dbProduct._id.toString(),
			title: dbProduct.title,
			handle: dbProduct.parentSku,
			description: dbProduct.description,
			descriptionHtml: dbProduct.descriptionHtml,
			status: "ACTIVE",
			vendor: "ACPOCO",
			productType: dbProduct.category?.name || "Uncategorized",
			createdAt: dbProduct.createdAt,
			updatedAt: dbProduct.updatedAt,
			tags: [],
			totalInventory: variants.reduce((sum, v) => sum + (v.stock || 0), 0),
			onlineStoreUrl: "",
			images: {
				edges: dbProduct.images.map((url: string, index: number) => ({
					node: {
						id: `image-${index}`,
						url,
						altText: dbProduct.title,
						width: 800,
						height: 800,
					},
				})),
			},
			variants: {
				edges: variants.map((variant) => ({
					node: {
						id: variant._id.toString(),
						title: variant.attributes.map((attr) => attr.value).join(" / "),
						price: variant.price.toString(),
						compareAtPrice: null,
						inventoryQuantity: variant.stock || 0,
						availableForSale: (variant.stock || 0) > 0,
						sku: variant.childSku,
						requiresShipping: true,
						taxable: true,
						selectedOptions: variant.attributes.map((attr) => ({
							name: attr.name,
							value: attr.value,
						})),
						image:
							dbProduct.images.length > 0
								? {
										id: `image-0`,
										url: dbProduct.images[0],
										altText: dbProduct.title,
										width: 800,
										height: 800,
									}
								: undefined,
					},
				})),
			},
			collections: {
				edges: dbProduct.category
					? [
							{
								node: {
									id: dbProduct.category._id.toString(),
									title: dbProduct.category.name,
									handle: dbProduct.category.name
										.toLowerCase()
										.replace(/\s+/g, "-"),
								},
							},
						]
					: [],
			},
			options: dbProduct.attributes.map((attr, index: number) => ({
				id: `option-${index}`,
				name: attr.name,
				values: attr.values,
			})),
			seo: {
				title: dbProduct.title,
				description: dbProduct.description,
			},
		};
	} catch (error) {
		console.error("Error fetching product:", error);
		throw new Error(
			`Product not found: ${
				error instanceof Error ? error.message : "Unknown error"
			}`,
		);
	}

	if (!product) {
		throw new Error("Product not found - no product data returned");
	}

	// Find initial variant based on search params
	let initialVariant: ShopifyVariant | undefined;

	if (
		Object.keys(searchParams).length > 0 &&
		product.variants?.edges.length > 0
	) {
		// Convert search params to expected format
		const searchOptions: Record<string, string> = {};
		Object.entries(searchParams).forEach(([key, value]) => {
			if (typeof value === "string") {
				searchOptions[key] = value;
			} else if (Array.isArray(value) && value.length > 0) {
				searchOptions[key] = value[0];
			}
		});

		// Find matching variant
		initialVariant = product.variants.edges.find((edge) => {
			const variant = edge.node;

			return variant.selectedOptions.every(
				(option) => searchOptions[option.name] === option.value,
			);
		})?.node;
	}

	// Fallback to first available variant
	if (!initialVariant && product.variants?.edges.length > 0) {
		initialVariant = product.variants.edges[0].node;
	}

	return (
		<ShopifyProductClient product={product} initialVariant={initialVariant} />
	);
};

export default ProductPage;
