"use client";

import { MagnifyingGlassIcon, TrashIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";

import { useDiscounts } from "@/hooks/useDiscounts";
import type { IProduct } from "@/models/Product";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

type Props = {
	product: IProduct;
	isSelected?: boolean;
	onSelectChange?: (checked: boolean) => void;
};

const FavoriteProductCard: React.FC<Props> = ({
	product,
	isSelected,
	onSelectChange,
}) => {
	const queryClient = useQueryClient();
	const { getDiscountedPrice } = useDiscounts();
	const [isHovered, setIsHovered] = useState(false);
	const [isRemoving, setIsRemoving] = useState(false);
	const t = useTranslations("Common");

	const { finalPrice: discounted, discountPercent } = getDiscountedPrice(
		product.price,
		product.category?._id || (product.category as unknown as string),
		product._id,
	);
	const showDiscount = discountPercent > 0;
	const basePrice = product.price;

	const removeFromFavorites = async () => {
		await axios.delete(`/api/favorites`, {
			data: { productId: product._id },
		});
	};

	const mutation = useMutation({
		mutationFn: removeFromFavorites,
		onMutate: () => {
			setIsRemoving(true);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
		onError: () => {
			setIsRemoving(false);
		},
	});

	const handleRemoveFromFavorites = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		mutation.mutate();
	};

	return (
		<div
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					// Toggle selection or navigate?
					// For now just prevent default if it's a wrapper
				}
			}}
			className={`
				group relative flex flex-col overflow-hidden rounded-xl
				bg-white/80 backdrop-blur-sm
				border border-gray-100
				shadow-[0_2px_12px_-4px_rgba(0,0,0,0.08)]
				transition-all duration-300 ease-out
				hover:shadow-[0_12px_32px_-8px_rgba(101,69,245,0.2)]
				hover:border-sage-blue/20
				hover:-translate-y-1
				${isRemoving ? "opacity-50 scale-95 pointer-events-none" : ""}
				${isSelected ? "ring-2 ring-sage-blue ring-offset-1" : ""}
			`}
		>
			{/* Selection Checkbox - Floating Style */}
			<div
				className={`
					absolute top-2 left-2 z-20
					transition-all duration-300 ease-out
					${isHovered || isSelected ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}
				`}
			>
				<label className="relative flex items-center justify-center w-5 h-5 cursor-pointer">
					<input
						type="checkbox"
						checked={isSelected}
						onChange={(e) => onSelectChange?.(e.target.checked)}
						className="peer sr-only"
					/>
					<div
						className={`
						w-5 h-5 rounded-md
						bg-white/90 backdrop-blur-md
						border-2 border-gray-200
						shadow-md
						flex items-center justify-center
						transition-all duration-200
						peer-checked:bg-gradient-to-br peer-checked:from-sage-blue peer-checked:to-indigo-500
						peer-checked:border-transparent
						peer-hover:border-sage-blue/50
					`}
					>
						<svg
							className={`w-3 h-3 text-white transition-all duration-200 ${isSelected ? "opacity-100 scale-100" : "opacity-0 scale-50"}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							strokeWidth={3}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>
				</label>
			</div>

			{/* Favorite Heart Badge */}
			<div className="absolute top-2 right-2 z-20">
				<div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-400 to-rose-500 shadow-md flex items-center justify-center">
					<HeartSolid className="w-3.5 h-3.5 text-white" />
				</div>
			</div>

			{/* Discount Badge */}
			{showDiscount && (
				<div className="absolute top-9 right-2 z-20">
					<div className="px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 shadow-md">
						<span className="text-[10px] font-bold text-white">
							%{discountPercent}
						</span>
					</div>
				</div>
			)}

			{/* Image Container */}
			<div className="relative overflow-hidden">
				<div className="aspect-square">
					<Image
						alt={product.title}
						src={normalizeImageSrc(product.images[0])}
						width={400}
						height={400}
						className={`
							w-full h-full object-cover
							transition-transform duration-700 ease-out
							group-hover:scale-110
						`}
					/>
				</div>

				{/* Gradient Overlay on Hover */}
				<div
					className={`
					absolute inset-0
					bg-gradient-to-t from-black/40 via-transparent to-transparent
					transition-opacity duration-300
					${isHovered ? "opacity-100" : "opacity-0"}
				`}
				/>

				{/* Quick Actions on Hover */}
				<div
					className={`
					absolute bottom-2 left-1/2 -translate-x-1/2
					flex items-center gap-2
					transition-all duration-300 ease-out
					${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
				`}
				>
					<Link
						href={`/product/${product._id}`}
						className="
							flex items-center gap-1.5
							px-3 py-1.5
							bg-white/95 backdrop-blur-md
							rounded-full
							shadow-lg
							text-xs font-medium text-gray-800
							transition-all duration-200
							hover:bg-sage-blue hover:text-white
							hover:scale-105
							active:scale-95
						"
					>
						<MagnifyingGlassIcon className="w-3.5 h-3.5" />
						<span>{t("view")}</span>
					</Link>
				</div>
			</div>

			{/* Content */}
			<div className="flex-1 flex flex-col p-3">
				{/* Title */}
				<Link
					href={`/product/${product._id}`}
					className="
						font-medium text-gray-800
						text-xs sm:text-sm
						line-clamp-2
						hover:text-sage-blue
						transition-colors duration-200
						mb-1
					"
				>
					{product.title}
				</Link>

				{/* SKU */}
				<p className="text-[10px] text-gray-400 mb-2">
					SKU: {product.parentSku}
				</p>

				{/* Price Section */}
				<div className="mt-auto">
					<div className="flex flex-wrap items-baseline gap-1.5 mb-2">
						{showDiscount ? (
							<>
								<span className="text-base sm:text-lg font-bold bg-gradient-to-r from-sage-blue to-indigo-500 bg-clip-text text-transparent">
									€{discounted}
								</span>
								<span className="text-xs text-gray-400 line-through">
									€{basePrice}
								</span>
								<span className="text-xs font-semibold text-emerald-600">
									%{discountPercent} {t("discount")}
								</span>
							</>
						) : (
							<span className="text-base sm:text-lg font-bold text-gray-800">
								€{basePrice}
							</span>
						)}
					</div>

					{/* Remove Button */}
					<button
						onClick={handleRemoveFromFavorites}
						disabled={isRemoving}
						className="
							w-full flex items-center justify-center gap-1.5
							py-1.5 px-3
							rounded-lg
							bg-gradient-to-r from-rose-50 to-red-50
							border border-rose-200
							text-rose-600
							font-medium text-xs
							transition-all duration-200
							hover:from-rose-500 hover:to-red-500
							hover:text-white hover:border-transparent
							hover:shadow-md hover:shadow-rose-200
							active:scale-[0.98]
							disabled:opacity-50 disabled:cursor-not-allowed
						"
					>
						<TrashIcon className="w-3.5 h-3.5" />
						<span>Favoriden Çıkar</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default FavoriteProductCard;
