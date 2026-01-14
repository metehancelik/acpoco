"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

import type { IDiscount } from "@/models/Discount";
import { calculateDiscountedPrice } from "@/utils/discountCalculator";
import httpClient from "@/utils/httpClient";

export function useDiscounts() {
	const { data: session } = useSession();

	const { data, isLoading } = useQuery({
		queryKey: ["user-discounts"],
		queryFn: async () => {
			const response = await httpClient.get("/discounts/user");
			return response.data.discounts as IDiscount[];
		},
		enabled: !!session,
	});

	const getDiscountedPrice = (
		basePrice: number,
		categoryId?: string,
		productId?: string,
	) => {
		if (!session || !data) return { finalPrice: basePrice, discountPercent: 0 };

		const result = calculateDiscountedPrice(
			basePrice,
			session.user.id,
			categoryId || "",
			productId || "",
			data,
		);

		return {
			finalPrice: result.finalPrice,
			discountPercent: result.discountPercent,
			appliedDiscount: result.appliedDiscount,
		};
	};

	return {
		discounts: data || [],
		isLoading,
		getDiscountedPrice,
	};
}
