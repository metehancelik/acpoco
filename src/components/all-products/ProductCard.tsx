"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";

import { useDiscounts } from "@/hooks/useDiscounts";
import type { IProduct } from "@/models/Product";
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
	);
	const showDiscount = discountPercent > 0;
	const basePrice = product.price;

	return (
		<div
			key={product._id}
			className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
		>
			<Image
				alt={product.images[0]}
				src={product.images[0]}
				width={400}
				height={400}
				className="aspect-square w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-square"
			/>
			<div className="flex flex-1 flex-col space-y-2 p-4">
				<Link href={`/product/${product._id}`}>{product.title}</Link>

				<p className="text-sm text-gray-500">SKU: {displaySku}</p>
				<div className="flex flex-1 items-end justify-between">
					<div className="flex items-center gap-2">
						{showDiscount ? (
							<>
								<span className="text-base font-semibold text-gray-900">
									€{discounted}
								</span>
								<span className="text-sm text-gray-500 line-through">
									€{basePrice}
								</span>
								<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
									%{discountPercent} {t("discount")}
								</span>
							</>
						) : (
							<span className="text-base font-medium text-gray-900">
								{t("price")}: €{basePrice}
							</span>
						)}
					</div>
				</div>
				<div className="flex items-center gap-x-2">
					<Link
						href={`/product/${product._id}`}
						className="flex items-center gap-x-2 bg-slate-700 text-white rounded-md px-2 py-2 text-sm w-full justify-center"
					>
						<p>{t("view")}</p>
						<MagnifyingGlassIcon className="" width={24} height={24} />
					</Link>
				</div>
			</div>
		</div>
	);
};

export default ProductCard;
