"use client";

import { HeartIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import AlertNotification from "@/utils/alertNotification";

type AddToCartButtonProps = {
	productId: string;
};

const AddToFavoritesButton = ({ productId }: AddToCartButtonProps) => {
	const queryClient = useQueryClient();
	const addFavorite = async (productId: string) => {
		try {
			const response = await axios.post(
				`${process.env.NEXT_PUBLIC_NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL_PROD}/favorites`,
				{ productId },
			);
			AlertNotification("Ürün favorilere eklendi", "success");

			return response.data;
		} catch (error: unknown) {
			AlertNotification("Ürün favorilere eklenirken bir hata oluştu", "error");
			console.error(error);
		}
	};
	const mutation = useMutation({
		mutationFn: addFavorite,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["favorites"] });
		},
	});

	return (
		<button
			onClick={() => mutation.mutate(productId)}
			className="flex max-w-xs flex-1 items-center space-x-2 justify-center rounded-md border border-transparent bg-slate-700 px-8 py-3 text-base font-medium text-white hover:bg-slate-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
		>
			<p>Favoriye Ekle</p>
			<HeartIcon height={24} width={24} />
		</button>
	);
};

export default AddToFavoritesButton;
