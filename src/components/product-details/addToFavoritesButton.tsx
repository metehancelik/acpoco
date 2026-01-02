"use client";

import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { BeatLoader } from "react-spinners";

import type { IProduct } from "@/models/Product";
import AlertNotification from "@/utils/alertNotification";
import type { ShopifyProduct } from "@/utils/shopify";

type AddToFavoritesButtonProps = {
	product: ShopifyProduct;
};

const AddToFavoritesButton = ({ product }: AddToFavoritesButtonProps) => {
	const { data: session } = useSession();
	const queryClient = useQueryClient();
	const t = useTranslations("Products");

	const productId = product.id.replace("gid://shopify/Product/", "");

	const { data: favorites = [], isLoading: isLoadingFavorites } = useQuery<
		IProduct[]
	>({
		queryKey: ["favorites"],
		queryFn: async () => {
			const response = await axios.get("/api/favorites");
			return response.data.favorites;
		},
		enabled: !!session,
	});

	const isFavorited = favorites.some((fav) => fav._id === productId);

	const addFavorite = async (id: string) => {
		const response = await axios.post("/api/favorites", { productId: id });
		return response.data;
	};

	const mutation = useMutation({
		mutationFn: addFavorite,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
			AlertNotification(t("addedToFavorites"), "success");
		},
		onError: (error: any) => {
			const message =
				error.response?.data?.error || t("errorAddingToFavorites");
			AlertNotification(message, "error");
			console.error(error);
		},
	});

	if (!session) return null;

	return (
		<button
			type="button"
			onClick={() => !isFavorited && mutation.mutate(productId)}
			disabled={isFavorited || mutation.isPending || isLoadingFavorites}
			className={`flex items-center justify-center space-x-2 rounded-lg px-4 py-2 text-base font-semibold transition-all duration-200 active:scale-95 ${
				isFavorited
					? "bg-rose-50 border border-rose-200 text-rose-600 cursor-not-allowed"
					: "bg-white border border-gray-200 text-gray-800 shadow-sm hover:border-rose-300 hover:text-rose-600 hover:shadow-md"
			} disabled:opacity-75`}
		>
			{mutation.isPending ? (
				<BeatLoader size={8} color="#e11d48" />
			) : (
				<>
					<span>{isFavorited ? t("inFavorites") : t("addToFavorites")}</span>
					{isFavorited ? (
						<HeartIconSolid className="h-6 w-6 text-rose-600" />
					) : (
						<HeartIconOutline className="h-6 w-6 transition-colors duration-200" />
					)}
				</>
			)}
		</button>
	);
};

export default AddToFavoritesButton;
