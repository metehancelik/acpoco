import { setRequestLocale } from "next-intl/server";

import ProductList from "@/components/all-products/ProductList";
import Pagination from "@/components/shared/Pagination";
import dbConnect from "@/lib/db";
import { CategoryModel } from "@/models/Category";
import Product, { type ICategory, type IProduct } from "@/models/Product";

type Props = {
	params: { locale: string };
	searchParams: { [key: string]: string };
};

const ITEMS_PER_PAGE = 24;

const AllProducts = async ({ params: { locale }, searchParams }: Props) => {
	setRequestLocale(locale);

	const page = Number(searchParams.page || 1);
	const DEFAULT_CATEGORY = "68fa224d4a779c7bb1e58ce5";
	const rawCategory = searchParams.category;
	const hasCategoryParam = Object.hasOwn(searchParams, "category");
	const category = hasCategoryParam ? rawCategory : DEFAULT_CATEGORY;

	const query = searchParams.query;

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
			await dbConnect();

			// biome-ignore lint/suspicious/noExplicitAny: complex mongoose filter
			const filter: Record<string, any> = {};
			if (category) {
				filter.category = category;
			}

			if (query) {
				const regex = new RegExp(query, "i");
				filter.$or = [
					{ title: { $regex: regex } },
					{ parentSku: { $regex: regex } },
				];
			}

			const totalItems = await Product.countDocuments(filter);
			const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
			const skip = (page - 1) * ITEMS_PER_PAGE;

			const products = await Product.find(filter)
				.populate("category")
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(ITEMS_PER_PAGE)
				.lean();

			return {
				products: JSON.parse(JSON.stringify(products)),
				pagination: {
					currentPage: page,
					totalPages,
					totalItems,
					itemsPerPage: ITEMS_PER_PAGE,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			};
		} catch (error) {
			console.error("Error fetching products:", error);

			return {
				products: [],
				pagination: {
					currentPage: 1,
					totalPages: 1,
					totalItems: 0,
					itemsPerPage: ITEMS_PER_PAGE,
					hasNextPage: false,
					hasPreviousPage: false,
				},
			};
		}
	};

	const getCategories = async (): Promise<ICategory[]> => {
		try {
			await dbConnect();
			const categories = await CategoryModel.find({}).sort({ name: 1 }).lean();

			return JSON.parse(JSON.stringify(categories));
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
