"use client";

import { Squares2X2Icon } from "@heroicons/react/24/outline";
import { Search } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { slugify } from "@/lib/utils";
import type { ICategory } from "@/models/Product";

type Props = {
	categories: ICategory[];
};

export default function HeroSection({ categories }: Props) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const t = useTranslations("AllProducts");
	const tCommon = useTranslations("Common");
	const tProducts = useTranslations("Products");

	const [query, setQuery] = useState("");

	useEffect(() => {
		const currentQuery = searchParams?.get("query");
		if (currentQuery) setQuery(currentQuery);
	}, [searchParams]);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		const params = new URLSearchParams(searchParams?.toString());
		if (query) params.set("query", query);
		else params.delete("query");
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
	const currentSlug = rawCategory ?? null;
	const isCategorySelected = (cat: ICategory) =>
		currentSlug != null && currentSlug === slugify(cat.name);

	return (
		<section
			aria-label="Search and browse products"
			className="relative mb-6 overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-black/5"
		>
			{/* Warm, soft gradient background — not flat white */}
			<div
				className="absolute inset-0 bg-linear-to-br from-amber-50/60 via-white to-stone-50/50"
				aria-hidden
			/>
			<div className="absolute top-0 right-0 h-72 w-72 -translate-y-1/3 translate-x-1/3 rounded-full bg-amber-100/40 blur-3xl" />
			<div className="absolute bottom-0 left-0 h-56 w-56 -translate-x-1/3 translate-y-1/3 rounded-full bg-stone-100/50 blur-3xl" />

			<div className="relative px-5 py-6 sm:px-8 sm:py-8">
				<div className="mb-6">
					<header className="mb-5">
						<h1 className="text-2xl font-bold tracking-tight text-stone-900 sm:text-3xl">
							{t("title")}
						</h1>
						<p className="mt-2 max-w-lg text-base text-stone-600">
							{t("description")}
						</p>
					</header>

					<form
						onSubmit={handleSearch}
						className="relative max-w-xl"
						role="search"
					>
						<label htmlFor="hero-search" className="sr-only">
							{tProducts("searchPlaceholder")}
						</label>
						<div className="group relative">
							<Search
								className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400 transition-colors duration-200 group-focus-within:text-amber-600"
								aria-hidden
							/>
							<input
								id="hero-search"
								type="search"
								placeholder={tProducts("searchPlaceholder")}
								className="w-full min-w-0 rounded-xl border border-stone-200 bg-white/90 py-3.5 pl-12 pr-14 text-stone-900 shadow-sm placeholder:text-stone-400 transition-colors duration-200 focus:border-gold focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold/25 sm:text-sm"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								aria-label={tProducts("searchPlaceholder")}
								enterKeyHint="search"
							/>
							<button
								type="submit"
								className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg bg-linear-to-r from-gold to-amber-500 p-2 text-white shadow-md shadow-amber-500/20 transition-all duration-200 hover:brightness-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 active:scale-95"
								aria-label={tCommon("search")}
							>
								<Search className="h-5 w-5" aria-hidden />
							</button>
						</div>
					</form>
				</div>

				{/* Categories — friendlier label and spacing */}
				<div>
					<div className="mb-3 flex items-center justify-between">
						<span className="text-sm font-medium text-stone-600">
							Browse by category
						</span>
						{currentSlug && currentSlug !== "all" && (
							<button
								type="button"
								onClick={() => handleCategoryClick(null)}
								className="text-sm font-medium text-stone-500 transition-colors duration-200 hover:text-stone-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 rounded-md"
							>
								Clear filter
							</button>
						)}
					</div>

					<div className="grid grid-cols-4 gap-3 sm:gap-4">
						<button
							type="button"
							onClick={() => handleCategoryClick(null)}
							className={`flex flex-col items-center justify-center gap-2 rounded-xl p-3 text-center transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
								!currentSlug || currentSlug === "all"
									? "bg-stone-900 text-white shadow-md"
									: "bg-white/80 text-stone-600 shadow-sm ring-1 ring-stone-200 hover:ring-stone-300 hover:bg-white"
							}`}
						>
							<div
								className={`rounded-full p-2 ${
									!currentSlug || currentSlug === "all"
										? "bg-white/20"
										: "bg-stone-100"
								}`}
							>
								<Squares2X2Icon className="h-5 w-5" aria-hidden />
							</div>
							<span className="text-xs font-semibold leading-tight">All</span>
						</button>

						{categories.slice(0, 7).map((cat) => (
							<button
								key={cat._id}
								type="button"
								onClick={() => handleCategoryClick(cat)}
								className={`group relative flex flex-col overflow-hidden rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold focus:ring-offset-2 ${
									isCategorySelected(cat)
										? "ring-2 ring-gold shadow-lg shadow-gold/10"
										: "ring-1 ring-stone-200 bg-white/80 shadow-sm hover:ring-stone-300 hover:bg-white hover:shadow-md"
								}`}
							>
								<div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
									<Image
										src={cat.image}
										alt={cat.name}
										fill
										className="object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:scale-100 motion-reduce:transition-none"
										sizes="(max-width: 640px) 22vw, 90px"
									/>
									{isCategorySelected(cat) && (
										<div
											className="absolute inset-0 bg-gold/20 mix-blend-multiply"
											aria-hidden
										/>
									)}
								</div>
								<span
									className={`mt-1.5 block truncate px-1 text-xs font-semibold leading-tight ${
										isCategorySelected(cat)
											? "text-amber-800"
											: "text-stone-600"
									}`}
								>
									{cat.name}
								</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
