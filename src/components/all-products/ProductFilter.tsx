"use client";

import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type React from "react";
import { useEffect, useState } from "react";

const ProductFilter = () => {
	const [query, setQuery] = useState("");
	const searchParams = useSearchParams();
	const router = useRouter();
	const t = useTranslations("Products");
	const tCommon = useTranslations("Common");

	useEffect(() => {
		const q = searchParams?.get("query") ?? "";
		setQuery(q);
	}, [searchParams]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams?.toString());
		if (query.trim()) params.set("query", query.trim());
		else params.delete("query");
		params.delete("page");
		router.push(`?${params.toString()}`);
	};
	const handleAllProducts = (e: React.SyntheticEvent) => {
		e.preventDefault();
		router.push(`?category=`);
	};

	return (
		<div
			className="flex w-full flex-col gap-3 rounded-2xl border border-stone-200/60 bg-white/95 backdrop-blur-sm p-4 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4"
			role="search"
			aria-label="Product search and filters"
		>
			<form className="relative min-w-0 flex-1" onSubmit={handleSubmit}>
				<label htmlFor="product-search" className="sr-only">
					{t("searchPlaceholder")}
				</label>
				<div className="group relative">
					<Search
						className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors duration-200 group-focus-within:text-amber-600"
						aria-hidden
					/>
					<input
						id="product-search"
						type="search"
						placeholder={t("searchPlaceholder")}
						className="w-full rounded-xl border border-stone-200/80 bg-stone-50/80 py-2.5 pl-9 pr-12 text-stone-900 placeholder:text-stone-400 transition-all duration-200 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:ring-offset-0 focus:shadow-[0_0_0_4px_rgba(217,119,6,0.12)] text-sm"
						onChange={handleChange}
						value={query}
						aria-label={t("searchPlaceholder")}
						enterKeyHint="search"
					/>
					<button
						type="submit"
						className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-linear-to-r from-gold to-amber-500 p-2 text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:brightness-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 active:scale-95"
						aria-label={t("findProduct")}
					>
						<Search className="h-4 w-4" aria-hidden />
					</button>
				</div>
			</form>
			<button
				type="button"
				onClick={handleAllProducts}
				className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-stone-200/80 bg-white px-3 py-2.5 text-sm font-medium text-stone-700 shadow-sm transition-all duration-200 hover:border-stone-300 hover:bg-stone-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-stone-300 focus:ring-offset-2 sm:shrink-0 active:scale-[0.98]"
			>
				<Squares2X2Icon className="h-4 w-4 text-stone-500" aria-hidden />
				{tCommon("viewAll")}
			</button>
		</div>
	);
};

export default ProductFilter;
