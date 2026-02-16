"use client";

import { MagnifyingGlassIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import type React from "react";
import { useState } from "react";

const ProductFilter = () => {
	const [query, setQuery] = useState("");
	const searchParams = useSearchParams();
	const router = useRouter();
	const t = useTranslations("Products");
	const tCommon = useTranslations("Common");

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};
	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams?.toString());
		params.set("query", query);
		params.delete("page");
		router.push(`?${params.toString()}`);
	};
	const handleAllProducts = (e: React.SyntheticEvent) => {
		e.preventDefault();
		router.push(`?category=`);
	};

	return (
		<div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<form
				className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center"
				onSubmit={handleSubmit}
			>
				<label htmlFor="product-search" className="sr-only">
					{t("searchPlaceholder")}
				</label>
				<div className="relative flex-1">
					<MagnifyingGlassIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
					<input
						id="product-search"
						type="text"
						placeholder={t("searchPlaceholder")}
						className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-gray-900 transition-colors placeholder:text-gray-400 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/20"
						onChange={handleChange}
						value={query}
					/>
				</div>
				<button
					type="submit"
					className="cursor-pointer rounded-xl bg-gold px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
				>
					{t("findProduct")}
				</button>
			</form>
			<button
				type="button"
				onClick={handleAllProducts}
				className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 sm:shrink-0"
			>
				<Squares2X2Icon className="h-5 w-5 text-gray-500" />
				{tCommon("viewAll")}
			</button>
		</div>
	);
};

export default ProductFilter;
