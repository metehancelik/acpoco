"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
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
			const res = await fetch(
				buildProductsUrl(pageParam, category, query),
			);
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

	const products =
		data?.pages.flatMap((p) => p.products) ?? [];

	if (isLoading) {
		return (
			<div className="py-4">
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
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
			<div className="py-4">
				<div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
					{products.map((product: IProduct) => (
						<ProductCard product={product} key={product._id} />
					))}
				</div>
			</div>
			<div
				ref={sentinelRef}
				className="flex min-h-[120px] items-center justify-center py-8"
				aria-hidden
			>
				{isFetchingNextPage && (
					<div className="flex items-center gap-2 text-gray-500">
						<svg
							className="h-5 w-5 animate-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							aria-hidden
						>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						<span className="text-sm">{tCommon("loading")}</span>
					</div>
				)}
			</div>
		</>
	);
}
