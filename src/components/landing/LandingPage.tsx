"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import Categories from "@/components/all-products/Categories";
import ProductFilter from "@/components/all-products/ProductFilter";
import type { ICategory } from "@/models/Product";

import InfiniteProductGrid from "./InfiniteProductGrid";

const DEFAULT_CATEGORY = "68fa224d4a779c7bb1e58ce5";

type LandingPageProps = {
	categories: ICategory[];
};

export default function LandingPage({ categories }: LandingPageProps) {
	const searchParams = useSearchParams();
	const t = useTranslations("AllProducts");
	const tCommon = useTranslations("Common");

	const rawCategory = searchParams?.get("category") ?? null;
	const hasCategoryParam = searchParams?.has("category") ?? false;
	const category = hasCategoryParam ? rawCategory : DEFAULT_CATEGORY;
	const query = searchParams?.get("query") ?? null;

	return (
		<div className="min-h-screen bg-gray-50/80">
			<div className="mx-auto max-w-6xl px-4 py-6 sm:py-8 lg:py-10">
				{/* Page title */}
				<header className="mb-8 border-b border-gray-200/80 pb-6">
					<h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
						{t("title")}
					</h1>
					<p className="mt-1 text-sm text-gray-500">{t("description")}</p>
				</header>

				{/* Categories */}
				<section className="mb-8">
					<Categories categories={categories} />
				</section>

				{/* Search */}
				<section className="mb-8 overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-sm ring-1 ring-gray-100">
					<div className="border-b border-gray-100 bg-linear-to-r from-gray-50 to-white px-4 py-3 sm:px-5">
						<span className="text-sm font-medium text-gray-700">
							{tCommon("search")} & {tCommon("filter")}
						</span>
					</div>
					<div className="px-4 py-4 sm:px-5 sm:py-5">
						<ProductFilter />
					</div>
				</section>

				{/* Products */}
				<section>
					<InfiniteProductGrid category={category} query={query} />
				</section>
			</div>
		</div>
	);
}
