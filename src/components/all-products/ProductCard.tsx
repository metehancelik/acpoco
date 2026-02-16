"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";

import { useDiscounts } from "@/hooks/useDiscounts";
import type { IProduct } from "@/models/Product";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";
import type { ShopifyVariant } from "@/utils/shopify";

type ProductWithShopify = IProduct & {
	shopifyData?: {
		variants: ShopifyVariant[];
	};
};

type Props = {
	product: ProductWithShopify;
};
const ProductCard: React.FC<Props> = ({ product }) => {
	const variants = product.shopifyData?.variants || [];
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
	const t = useTranslations("Common");
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

	return (
		<div
			key={product._id}
			className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm"
		>
			<Link href={`/product/${product._id}`} className="cursor-pointer">
				{hasValidImage ? (
					<Image
						alt={product.title}
						src={imageSrc}
						width={400}
						height={400}
						className="aspect-square w-full bg-gray-100 object-cover"
					/>
				) : (
					<div className="aspect-square w-full bg-gray-100" aria-hidden />
				)}
			</Link>
			<div className="flex flex-col gap-1 p-3">
				<Link
					href={`/product/${product._id}`}
					className="line-clamp-2 text-sm font-medium text-gray-900 cursor-pointer hover:text-gold transition-colors"
				>
					{product.title}
				</Link>
				<p className="text-xs text-gray-500 truncate">SKU: {displaySku}</p>
				<div className="flex flex-wrap items-center gap-1.5">
					{showDiscount ? (
						<>
							<span className="text-sm font-semibold text-gray-900">€{discounted}</span>
							<span className="text-xs text-gray-500 line-through">€{basePrice}</span>
							<span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium bg-green-100 text-green-800">
								%{discountPercent}
							</span>
						</>
					) : (
						<span className="text-sm font-medium text-gray-900">€{basePrice}</span>
					)}
				</div>
				<Link
					href={`/product/${product._id}`}
					className="mt-1 flex cursor-pointer items-center justify-center gap-1 rounded-md bg-slate-700 py-1.5 text-xs text-white transition-colors hover:bg-slate-600"
				>
					{t("view")}
					<MagnifyingGlassIcon className="h-4 w-4" />
				</Link>
			</div>
		</div>
	);
};

export default ProductCard;
