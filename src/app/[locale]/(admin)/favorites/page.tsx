"use client";

import { HeartIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { useQuery } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";

import DiscountRequestModal from "@/components/favorites/DiscountRequestModal";
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
				productId: item._id, // Pass product ID as string
			})) || [];

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 flex items-center justify-center">
				<Loading size={100} />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
			{/* Decorative Background Elements */}
			<div className="fixed inset-0 overflow-hidden pointer-events-none">
				<div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-sage-blue/10 to-purple-200/20 rounded-full blur-3xl" />
				<div className="absolute top-1/2 -left-20 w-60 h-60 bg-gradient-to-br from-rose-100/30 to-pink-200/20 rounded-full blur-3xl" />
				<div className="absolute bottom-20 right-1/4 w-40 h-40 bg-gradient-to-br from-teal-100/20 to-emerald-200/10 rounded-full blur-2xl" />
			</div>

			<div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
				{/* Header Section */}
				<div className="mb-10">
					<div className="flex items-center gap-3 mb-2">
						<div className="p-2.5 bg-gradient-to-br from-rose-400 to-rose-500 rounded-xl shadow-lg shadow-rose-200">
							<HeartSolid className="w-6 h-6 text-white" />
						</div>
						<h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
							Favorilerim
						</h1>
					</div>
					<p className="text-gray-500 mt-2 max-w-lg">
						Beğendiğiniz ürünleri buradan takip edebilir ve toplu indirim
						talebinde bulunabilirsiniz.
					</p>
				</div>

				{/* Actions Bar */}
				<div className="mb-8">
					<div
						className="
						flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4
						p-4 sm:p-5
						bg-white/70 backdrop-blur-xl
						rounded-2xl
						border border-white/50
						shadow-[0_4px_24px_-4px_rgba(0,0,0,0.06)]
					"
					>
						{/* Select All Checkbox */}
						<label className="flex items-center gap-3 cursor-pointer group">
							<div className="relative">
								<input
									type="checkbox"
									checked={
										favorites?.length > 0 &&
										selectedItemsIds.length === favorites.length
									}
									onChange={(e) => handleSelectAll(e.target.checked)}
									className="peer sr-only"
								/>
								<div
									className="
									w-6 h-6 rounded-lg
									border-2 border-gray-200
									bg-white
									flex items-center justify-center
									transition-all duration-200
									peer-checked:bg-gradient-to-br peer-checked:from-sage-blue peer-checked:to-indigo-500
									peer-checked:border-transparent
									group-hover:border-sage-blue/50
								"
								>
									<Check
										className={`h-3.5 w-3.5 text-white transition-all duration-200 stroke-3 ${
											favorites?.length > 0 &&
											selectedItemsIds.length === favorites.length
												? "opacity-100 scale-100"
												: "opacity-0 scale-50"
										}`}
										aria-hidden
									/>
								</div>
							</div>
							<span className="font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
								Tümünü Seç
							</span>
							{favorites?.length > 0 && (
								<span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-full">
									{favorites.length} ürün
								</span>
							)}
						</label>

						{/* Discount Request Button */}
						<div
							className={`
							transition-all duration-300 ease-out
							${
								selectedItemsIds.length > 0
									? "opacity-100 translate-x-0"
									: "opacity-0 translate-x-4 pointer-events-none"
							}
						`}
						>
							<button
								onClick={() => setIsDiscountModalOpen(true)}
								className="
									flex items-center gap-2
									px-5 py-3
									bg-gradient-to-r from-sage-blue to-indigo-500
									text-white
									rounded-xl
									font-semibold text-sm
									shadow-lg shadow-sage-blue/25
									transition-all duration-200
									hover:shadow-xl hover:shadow-sage-blue/30
									hover:scale-[1.02]
									active:scale-[0.98]
								"
							>
								<SparklesIcon className="w-5 h-5" />
								<span>
									Seçili ({selectedItemsIds.length}) Ürün İçin İndirim İste
								</span>
							</button>
						</div>
					</div>
				</div>

				{/* Empty State */}
				{favorites?.length === 0 && (
					<div
						className="
						flex flex-col items-center justify-center
						py-20
						bg-white/50 backdrop-blur-sm
						rounded-3xl
						border border-gray-100
					"
					>
						<div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
							<HeartIcon className="w-10 h-10 text-gray-400" />
						</div>
						<h3 className="text-xl font-semibold text-gray-700 mb-2">
							Henüz favori ürününüz yok
						</h3>
						<p className="text-gray-500 text-center max-w-sm">
							Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca
							erişebilirsiniz.
						</p>
					</div>
				)}

				{/* Products Grid */}
				{favorites?.length > 0 && (
					<div className="grid grid-cols-3 gap-3 sm:grid-cols-4 sm:gap-4 lg:grid-cols-5 xl:grid-cols-6 lg:gap-5">
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
				)}

				<DiscountRequestModal
					isOpen={isDiscountModalOpen}
					onClose={() => setIsDiscountModalOpen(false)}
					selectedItems={selectedFavoriteItems}
					onSuccess={() => setSelectedItemsIds([])}
				/>
			</div>
		</div>
	);
}
