"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import type React from "react";

import type { IProduct } from "@/models/Product";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

type Props = {
	product: IProduct;
};
const FavoriteProductCard: React.FC<Props> = ({ product }) => {
	const queryClient = useQueryClient();
	const { data: session } = useSession();
	const discountPercent = session?.user?.discountPercent || 0;
	const showDiscount = discountPercent > 0;
	const basePrice = product.price;
	const discounted = Number(
		(
			basePrice *
			(1 - Math.min(100, Math.max(0, discountPercent)) / 100)
		).toFixed(2),
	);
	const removeFromFavorites = async () => {
		await axios.delete(`/api/favorites`, {
			data: { productId: product._id },
		});
	};
	const mutation = useMutation({
		mutationFn: removeFromFavorites,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});

	const handleRemoveFromFavorites = () => {
		mutation.mutate();
	};

	return (
		<div
			key={product._id}
			className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
		>
			<Image
				alt={product.images[0]}
				src={normalizeImageSrc(product.images[0])}
				width={400}
				height={400}
				className="aspect-square w-full bg-gray-200 object-cover group-hover:opacity-75 sm:aspect-square"
			/>
			<div className="flex flex-1 flex-col space-y-2 p-4">
				<Link href={`/product/${product._id}`}>{product.title}</Link>

				<p className="text-sm text-gray-500">SKU: {product.parentSku}</p>
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
									%{discountPercent} indirim
								</span>
							</>
						) : (
							<span className="text-base font-medium text-gray-900">
								Fiyat: €{basePrice}
							</span>
						)}
					</div>
				</div>
				<div className="flex items-center gap-x-2">
					<Link
						href={`/product/${product._id}`}
						className="flex items-center gap-x-2 bg-slate-700 text-white rounded-md px-2 py-2 text-sm w-full justify-center"
					>
						<p>İncele</p>
						<MagnifyingGlassIcon className="" width={24} height={24} />
					</Link>
				</div>
				<button
					className="bg-red-500 text-white rounded-md px-2 py-2 text-sm w-full justify-center"
					onClick={handleRemoveFromFavorites}
				>
					Fovoriden Çıkar
				</button>
			</div>
		</div>
	);
};

export default FavoriteProductCard;
