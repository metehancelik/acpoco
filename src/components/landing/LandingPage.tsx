"use client";

import { useSearchParams } from "next/navigation";

import { slugify } from "@/lib/utils";
import type { ICategory } from "@/models/Product";

import InfiniteProductGrid from "./InfiniteProductGrid";
import LandingSidebar from "./LandingSidebar";

const DEFAULT_CATEGORY_ID = "68fa224d4a779c7bb1e58ce5";

type LandingPageProps = {
	categories: ICategory[];
};

export default function LandingPage({ categories }: LandingPageProps) {
	const searchParams = useSearchParams();

	const rawCategory = searchParams?.get("category") ?? null;
	// "all" or empty → no filter. No param → default category. Slug → resolve to id.
	const categoryId =
		rawCategory === "all" || rawCategory === ""
			? null
			: rawCategory === null
				? DEFAULT_CATEGORY_ID
				: (() => {
						const found = categories.find(
							(c) => slugify(c.name) === rawCategory,
						);
						return found ? found._id : null;
					})();
	const query = searchParams?.get("query") ?? null;

	return (
		<div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto lg:flex-row lg:overflow-hidden">
			<LandingSidebar
				categories={categories}
				defaultCategoryId={DEFAULT_CATEGORY_ID}
			/>
			<main
				id="main-scroll"
				className="relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto px-0 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-4 xl:px-8"
			>
				<section aria-label="Product list" className="space-y-0">
					<InfiniteProductGrid category={categoryId} query={query} />
				</section>
			</main>
		</div>
	);
}
