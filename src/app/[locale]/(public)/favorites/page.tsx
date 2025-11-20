"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import FavoriteProductCard from "@/components/favorites/FavoriteProductCard";
import Loading from "@/components/shared/Loading";
import type { IProduct } from "@/models/Product";

export default function FavoritesPage() {
	const session = useSession();
	const router = useRouter();

	if (!session) {
		router.push("/login");
	}
	const getFavorites = async () => {
		const res = await axios.get(
			`${process.env.NEXT_PUBLIC_NODE_ENV === "development" ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_API_URL_PROD}/favorites`,
		);

		return res.data.favorites;
	};
	const { data: favorites = [], isLoading } = useQuery({
		queryKey: ["favorites"],
		queryFn: getFavorites,
	});

	if (isLoading) {
		return <Loading size={100} />;
	}

	return (
		<div className="mx-auto max-w-2xl px-4 lg:px-0 py-8 lg:py-16 lg:max-w-6xl">
			<h1 className="text-2xl font-bold mb-6">Favorilerim</h1>
			<div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
				{favorites?.map((favorite: IProduct) => (
					<FavoriteProductCard product={favorite} key={favorite._id} />
				))}
			</div>
		</div>
	);
}
