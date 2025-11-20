import { setRequestLocale } from "next-intl/server";

import ProductList from "@/components/all-products/ProductList";
import Pagination from "@/components/shared/Pagination";
import type { ICategory, IProduct } from "@/models/Product";

type Props = {
	params: { locale: string };
	searchParams: { [key: string]: string | string[] | undefined };
};

const AllProducts = async ({ params: { locale }, searchParams }: Props) => {
	setRequestLocale(locale);

	const page = Number(searchParams.page || 1);
	const category = (searchParams.category as string) || "";

	// API base URL
	const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

	const getProducts = async (): Promise<{
		products: IProduct[];
		pagination: {
			currentPage: number;
			totalPages: number;
			totalItems: number;
			itemsPerPage: number;
			hasNextPage: boolean;
			hasPreviousPage: boolean;
		};
	}> => {
		try {
			const params = new URLSearchParams();
			params.set("page", page.toString());
			if (category) {
				params.set("category", category);
			}

			const response = await fetch(`${baseUrl}/catalog?${params}`, {
				cache: "no-store",
			});

			if (!response.ok) {
				throw new Error("Failed to fetch products");
			}

			const result = await response.json();

			if (!result.success) {
				throw new Error(result.error || "Failed to fetch products");
			}

			return result.data;
		} catch (error) {
			console.error("Error fetching products:", error);

			return {
				products: [],
				pagination: {
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: 24,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			};
		}
	};

	const getCategories = async (): Promise<ICategory[]> => {
		try {
			const response = await fetch(`${baseUrl}/categories`, {
				cache: "no-store",
			});

			if (!response.ok) {
				throw new Error("Failed to fetch categories");
			}

			const categories = await response.json();

			return categories;
		} catch (error) {
			console.error("Error fetching categories:", error);

			return [];
		}
	};

	const [productsData, categoriesData] = await Promise.all([
		getProducts(),
		getCategories(),
	]);

	const { products, pagination } = productsData;
	const categories = categoriesData;

	return (
		<div>
			<ProductList products={products} categories={categories} />
			<div className="max-w-6xl w-full mx-auto px-4">
				<Pagination totalPages={pagination.totalPages} />
			</div>
		</div>
	);
};

export default AllProducts;
