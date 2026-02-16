"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useRef } from "react";

import ProductCard from "@/components/all-products/ProductCard";
import type { IProduct } from "@/models/Product";

type ProductsResponse = {
	products: IProduct[];
	hasNextPage: boolean;
	nextPage: number | null;
	page: number;
};

function buildProductsUrl(
	page: number,
	category: string | null,
	query: string | null,
): string {
	const params = new URLSearchParams();
	params.set("page", String(page));
	if (category) params.set("category", category);
	if (query?.trim()) params.set("query", query.trim());
	return `/api/products?${params.toString()}`;
}

type InfiniteProductGridProps = {
	category: string | null;
	query: string | null;
};

export default function InfiniteProductGrid({
	category,
	query,
}: InfiniteProductGridProps) {
	const t = useTranslations("AllProducts");
	const tCommon = useTranslations("Common");
	const sentinelRef = useRef<HTMLDivElement>(null);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		status,
	} = useInfiniteQuery({
		queryKey: ["products", "infinite", category, query],
		queryFn: async ({ pageParam }) => {
			const res = await fetch(buildProductsUrl(pageParam, category, query));
			if (!res.ok) throw new Error("Failed to fetch products");
			return res.json() as Promise<ProductsResponse>;
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
	});

	const observeSentinel = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries;
			if (
				entry?.isIntersecting &&
				hasNextPage &&
				!isFetchingNextPage &&
				status === "success"
			) {
				fetchNextPage();
			}
		},
		[hasNextPage, isFetchingNextPage, status, fetchNextPage],
	);

	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel) return;
		const observer = new IntersectionObserver(observeSentinel, {
			rootMargin: "200px",
			threshold: 0,
		});
		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [observeSentinel]);

	const products = data?.pages.flatMap((p) => p.products) ?? [];

	if (isLoading) {
		return (
			<div className="py-3 lg:py-4">
				<div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 xl:gap-5">
					{Array.from({ length: 8 }).map((_, i) => (
						<div
							key={i}
							className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md"
							aria-hidden
						>
							<div className="aspect-square w-full animate-pulse bg-gray-200" />
							<div className="space-y-2 p-4">
								<div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
								<div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
								<div className="h-6 w-1/3 animate-pulse rounded bg-gray-200" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	if (products.length === 0) {
		return (
			<div className="py-16 text-center">
				<p className="text-gray-600">{t("noProductsFound")}</p>
			</div>
		);
	}

	return (
		<>
			<div className="py-3 lg:py-4">
				<div className="grid min-w-0 grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 xl:gap-5">
					{products.map((product: IProduct) => (
						<ProductCard product={product} key={product._id} />
					))}
				</div>
			</div>
			<div
				ref={sentinelRef}
				className="flex min-h-[80px] items-center justify-center py-5"
				aria-hidden
			>
				{isFetchingNextPage && (
					<div className="flex items-center gap-2 text-gray-500">
						<Loader2 className="h-5 w-5 animate-spin" aria-hidden />
						<span className="text-sm">{tCommon("loading")}</span>
					</div>
				)}
			</div>
		</>
	);
}
