"use client";

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
		<div className="flex items-center space-x-2 w-full lg:w-1/2 mx-auto mb-12 flex-col sm:flex-row gap-2">
			<form
				className="flex w-full gap-2 flex-col sm:flex-row"
				onSubmit={handleSubmit}
			>
				<input
					type="text"
					placeholder={t("searchPlaceholder")}
					className="flex-1 px-4 py-2 border border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder:text-xs lg:placeholder:text-base"
					onChange={handleChange}
					value={query}
				/>
				<button
					type="submit"
					className="px-6 py-2 bg-slate-700 text-white rounded-full hover:bg-slate-500 focus:outline-none text-sm lg:text-base"
				>
					{t("findProduct")}
				</button>
			</form>
			<button
				onClick={handleAllProducts}
				className="w-full sm:w-48 px-6 py-2 bg-white text-slate-700 rounded-full border border-slate-700 hover:bg-slate-700 hover:text-white focus:outline-none text-sm lg:text-base"
			>
				{tCommon("viewAll")}
			</button>
		</div>
	);
};

export default ProductFilter;
