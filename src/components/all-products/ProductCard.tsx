"use client";

import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";

import { useDiscounts } from "@/hooks/useDiscounts";
import type { IProduct } from "@/models/Product";
import { useProductSelectionStore } from "@/store/productSelectionStore";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";
import type { ShopifyVariant } from "@/utils/shopify";

type ProductWithShopify = IProduct & {
	shopifyData?: {
		variants: ShopifyVariant[];
	};
};

type Props = {
	product: ProductWithShopify;
	selectionMode?: boolean;
};

const ProductCard: React.FC<Props> = ({ product, selectionMode = false }) => {
	const { toggle, isSelected } = useProductSelectionStore();
	const selected = isSelected(product._id);
	const variants = product.shopifyData?.variants || [];
	// Calculate total stock count across all variants
	const stockQuantity = variants.reduce(
		(total, variant) => total + (variant.inventoryQuantity ?? 0),
		0,
	);
	// Product is in stock if any variant has inventory and is available for sale
	const inStock = variants.some(
		(v) => v.availableForSale && (v.inventoryQuantity ?? 0) > 0,
	);

	const availableWithSku = variants.find(
		(v) =>
			v.availableForSale &&
			v.inventoryQuantity > 0 &&
			v.sku &&
			v.sku.trim() !== "",
	);
	const anyWithSku = variants.find((v) => v.sku && v.sku.trim() !== "");
	const displaySku =
		(availableWithSku || anyWithSku || variants[0])?.sku ||
		product.parentSku ||
		"N/A";

	const { getDiscountedPrice } = useDiscounts();
	const tProducts = useTranslations("Products");
	const { finalPrice: discounted, discountPercent } = getDiscountedPrice(
		product.price,
		product.category?._id || (product.category as unknown as string),
		product._id,
	);
	const showDiscount = discountPercent > 0;
	const basePrice = product.price;
	const imageSrc = product.images?.[0]
		? normalizeImageSrc(product.images[0])
		: "";
	const hasValidImage = imageSrc.length > 0;

	const stockLabel = inStock ? tProducts("inStock") : tProducts("outOfStock");
	const stockVariant = inStock ? "ok" : "out";
	const isLowStock = inStock && stockQuantity <= 5;

	return (
		<div
			key={product._id}
			className={`group relative flex min-w-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
				selected
					? "border-amber-500 ring-2 ring-amber-400/50 shadow-amber-100"
					: "border-stone-200/80 hover:border-stone-300/80"
			}`}
		>
			{/* Selection checkbox – visible on hover or when selection mode is active */}
			<button
				type="button"
				aria-label={selected ? "Seçimi kaldır" : "Ürünü seç"}
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					toggle(product._id);
				}}
				className={`absolute left-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
					selected
						? "border-amber-500 bg-amber-500 text-white opacity-100"
						: "border-stone-300 bg-white/90 text-transparent opacity-0 group-hover:opacity-100"
				} ${selectionMode ? "opacity-100" : ""}`}
			>
				<Check className="h-3.5 w-3.5" strokeWidth={3} />
			</button>

			<Link
				href={`/product/${product._id}`}
				className="cursor-pointer block focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 rounded-t-xl"
			>
				{hasValidImage ? (
					<Image
						alt={product.title}
						src={imageSrc}
						width={400}
						height={400}
						className="aspect-square w-full bg-stone-100 object-cover transition-opacity duration-200 group-hover:opacity-95"
					/>
				) : (
					<div className="aspect-square w-full bg-stone-100" aria-hidden />
				)}
			</Link>
			<div className="flex flex-col gap-2 p-4">
				<Link
					href={`/product/${product._id}`}
					className="line-clamp-2 text-sm font-medium text-stone-900 cursor-pointer hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:rounded"
				>
					{product.title}
				</Link>
				<p className="text-xs text-stone-500 truncate">SKU: {displaySku}</p>
				<div className="flex flex-wrap items-center gap-2">
					{showDiscount ? (
						<>
							<span className="text-base font-semibold text-stone-900">
								€{discounted}
							</span>
							<span className="text-sm text-stone-400 line-through">
								€{basePrice}
							</span>
							<span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/80">
								−{discountPercent}%
							</span>
						</>
					) : (
						<span className="text-base font-semibold text-stone-900">
							€{basePrice}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2 pt-0.5">
					<span
						className={`text-xs font-medium ${
							stockVariant === "out"
								? "text-red-600"
								: isLowStock
									? "text-amber-600"
									: "text-stone-500"
						}`}
					>
						{stockVariant === "out"
							? stockLabel
							: `${stockQuantity} ${stockLabel}`}
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
