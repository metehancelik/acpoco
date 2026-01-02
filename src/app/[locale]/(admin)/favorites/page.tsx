"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import DiscountRequestModal from "@/components/cart/DiscountRequestModal";
import FavoriteProductCard from "@/components/favorites/FavoriteProductCard";
import Loading from "@/components/shared/Loading";
import type { IProduct } from "@/models/Product";
import httpClient from "@/utils/httpClient";

export default function FavoritesPage() {
	const session = useSession();
	const router = useRouter();
	const [selectedItemsIds, setSelectedItemsIds] = useState<string[]>([]);
	const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

	if (session.status === "unauthenticated") {
		router.push("/login");
	}
	const getFavorites = async () => {
		const res = await httpClient.get("/favorites");
		return res.data.favorites;
	};
	const { data: favorites = [], isLoading } = useQuery<IProduct[]>({
		queryKey: ["favorites"],
		queryFn: getFavorites,
		enabled: session.status === "authenticated",
	});

	const handleSelectItem = (id: string, checked: boolean) => {
		if (checked) {
			setSelectedItemsIds((prev: string[]) => [...prev, id]);
		} else {
			setSelectedItemsIds((prev: string[]) =>
				prev.filter((itemId) => itemId !== id),
			);
		}
	};

	const handleSelectAll = (checked: boolean) => {
		if (checked && favorites) {
			setSelectedItemsIds(favorites.map((item) => item._id));
		} else {
			setSelectedItemsIds([]);
		}
	};

	const selectedFavoriteItems =
		favorites
			?.filter((item) => selectedItemsIds.includes(item._id))
			.map((item) => ({
				_id: item._id, // Product ID
				title: item.title,
				price: item.price,
				count: 1, // Default count for favorites
				productId: item, // Pass the whole object as well
			})) || [];

	if (isLoading) {
		return <Loading size={100} />;
	}

	return (
		<div className="mx-auto max-w-2xl px-4 lg:px-0 py-8 lg:py-16 lg:max-w-6xl min-h-screen">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
				<h1 className="text-2xl font-bold">Favorilerim</h1>

				<div className="flex items-center gap-4">
					<div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-md border text-sm">
						<input
							type="checkbox"
							checked={
								favorites?.length > 0 &&
								selectedItemsIds.length === favorites.length
							}
							onChange={(e) => handleSelectAll(e.target.checked)}
							className="w-4 h-4 rounded border-gray-300 text-sage-blue focus:ring-sage-blue cursor-pointer"
						/>
						<span className="font-medium text-gray-700">Tümünü Seç</span>
					</div>

					{selectedItemsIds.length > 0 && (
						<button
							onClick={() => setIsDiscountModalOpen(true)}
							className="bg-sage-blue hover:bg-indigo-400 text-white px-6 py-2 rounded-md transition-colors font-medium shadow-sm flex items-center gap-2"
						>
							Seçili ({selectedItemsIds.length}) Ürün İçin İndirim İste
						</button>
					)}
				</div>
			</div>

			<div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
				{favorites?.map((favorite: IProduct) => (
					<FavoriteProductCard
						product={favorite}
						key={favorite._id}
						isSelected={selectedItemsIds.includes(favorite._id)}
						onSelectChange={(checked) =>
							handleSelectItem(favorite._id, checked)
						}
					/>
				))}
			</div>

			<DiscountRequestModal
				isOpen={isDiscountModalOpen}
				onClose={() => setIsDiscountModalOpen(false)}
				selectedItems={selectedFavoriteItems}
				onSuccess={() => setSelectedItemsIds([])}
			/>
		</div>
	);
}
