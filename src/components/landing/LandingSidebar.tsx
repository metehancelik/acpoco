"use client";

import { Squares2X2Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { slugify } from "@/lib/utils";
import type { ICategory } from "@/models/Product";

type Props = {
	categories: ICategory[];
	defaultCategoryId: string;
};

export default function LandingSidebar({
	categories,
	defaultCategoryId,
}: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const tCommon = useTranslations("Common");
	const tProducts = useTranslations("Products");

	const [query, setQuery] = useState("");

	useEffect(() => {
		setQuery(searchParams?.get("query") ?? "");
	}, [searchParams]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams?.toString());
		if (query.trim()) params.set("query", query.trim());
		else params.delete("query");
		params.delete("page");
		router.push(`?${params.toString()}`);
	};

	const handleClearSearch = () => {
		setQuery("");
		const params = new URLSearchParams(searchParams?.toString());
		params.delete("query");
		params.delete("page");
		router.push(`?${params.toString()}`);
	};

	const handleCategoryClick = (category: ICategory | null) => {
		const params = new URLSearchParams(searchParams?.toString());
		if (category) params.set("category", slugify(category.name));
		else params.set("category", "all");
		params.delete("page");
		router.push(`?${params.toString()}`);
	};

	const rawCategory = searchParams?.get("category");
	const defaultCategory = categories.find((c) => c._id === defaultCategoryId);
	const defaultSlug = defaultCategory ? slugify(defaultCategory.name) : null;
	const isAll = rawCategory === "all" || rawCategory === null;
	const currentSlug = rawCategory ?? defaultSlug;
	const isCategorySelected = (cat: ICategory) =>
		!isAll && currentSlug === slugify(cat.name);

	return (
		<aside
			aria-label="Search and filters"
			className="flex h-full w-full flex-col border-r border-stone-200/60 bg-white/90 backdrop-blur-xl lg:h-full lg:w-72 lg:overflow-y-auto lg:rounded-2xl lg:border-0 lg:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_24px_-8px_rgba(0,0,0,0.12),0_0_0_1px_rgba(255,255,255,0.6)_inset] xl:w-72"
		>
			<div className="flex flex-col gap-4 p-4 sm:p-5">
				<form onSubmit={handleSearch} className="relative" role="search">
					<label htmlFor="sidebar-search" className="sr-only">
						{tProducts("searchPlaceholder")}
					</label>
					<div className="group relative">
						<Search
							className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400 transition-colors duration-200 group-focus-within:text-amber-600"
							aria-hidden
						/>
						<input
							id="sidebar-search"
							type="search"
							placeholder={tProducts("searchPlaceholder")}
							className="hide-search-cancel w-full min-w-0 rounded-xl border border-stone-200/80 bg-stone-50/80 py-2.5 pl-9 pr-20 text-stone-900 placeholder:text-stone-400 transition-all duration-200 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/30 focus:ring-offset-0 focus:shadow-[0_0_0_4px_rgba(217,119,6,0.12)] text-sm"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							aria-label={tProducts("searchPlaceholder")}
							enterKeyHint="search"
						/>
						{query ? (
							<button
								type="button"
								onClick={handleClearSearch}
								className="absolute right-11 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-stone-400 transition-colors hover:bg-stone-200/80 hover:text-stone-600 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2"
								aria-label="Clear search"
							>
								<XMarkIcon className="h-4 w-4" aria-hidden />
							</button>
						) : null}
						<button
							type="submit"
							className="absolute right-1.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-linear-to-r from-gold to-amber-500 p-1.5 text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:brightness-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 active:scale-95"
							aria-label={tCommon("search")}
						>
							<Search className="h-4 w-4" aria-hidden />
						</button>
					</div>
				</form>

				<div>
					<div className="mb-2 flex items-center justify-between">
						<span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
							Categories
						</span>
						{!isAll && (
							<button
								type="button"
								onClick={() => handleCategoryClick(null)}
								className="text-xs font-medium text-stone-500 transition-colors duration-200 hover:text-gold cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-md px-1.5 py-0.5"
							>
								Clear
							</button>
						)}
					</div>
					<div className="grid grid-cols-4 gap-2 lg:grid-cols-2 lg:gap-2.5">
						<button
							type="button"
							onClick={() => handleCategoryClick(null)}
							className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2.5 text-center transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 active:scale-[0.98] ${
								isAll
									? "bg-stone-900 text-white shadow-lg shadow-stone-900/20 ring-2 ring-stone-900/20"
									: "bg-white/80 text-stone-600 ring-1 ring-stone-200/80 shadow-sm hover:bg-white hover:ring-stone-300 hover:shadow-md"
							}`}
						>
							<div
								className={`rounded-full p-1.5 transition-colors ${
									isAll ? "bg-white/25" : "bg-stone-100"
								}`}
							>
								<Squares2X2Icon className="h-4 w-4" aria-hidden />
							</div>
							<span className="text-[11px] font-semibold leading-tight">
								All
							</span>
						</button>
						{categories.slice(0, 7).map((cat) => (
							<button
								key={cat._id}
								type="button"
								onClick={() => handleCategoryClick(cat)}
								className={`group relative flex flex-col overflow-hidden rounded-xl transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 active:scale-[0.98] ${
									isCategorySelected(cat)
										? "ring-2 ring-gold shadow-lg shadow-gold/20"
										: "ring-1 ring-stone-200/80 bg-white/80 shadow-sm hover:bg-white hover:ring-stone-300 hover:shadow-md"
								}`}
							>
								<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100 ring-1 ring-black/5">
									<Image
										src={cat.image}
										alt={cat.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-110 motion-reduce:scale-100 motion-reduce:transition-none"
										sizes="(max-width: 1024px) 25vw, 80px"
									/>
									{isCategorySelected(cat) && (
										<div
											className="absolute inset-0 bg-linear-to-t from-amber-900/30 to-transparent"
											aria-hidden
										/>
									)}
									<div
										className="absolute inset-0 rounded-lg ring-inset ring-white/40"
										aria-hidden
									/>
								</div>
								<span
									className={`mt-1 block truncate px-0.5 text-[11px] font-semibold leading-tight transition-colors ${
										isCategorySelected(cat)
											? "text-amber-800"
											: "text-stone-600 group-hover:text-stone-800"
									}`}
								>
									{cat.name}
								</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
