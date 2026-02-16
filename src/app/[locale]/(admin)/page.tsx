import { setRequestLocale } from "next-intl/server";

import LandingPage from "@/components/landing/LandingPage";
import dbConnect from "@/lib/db";
import { CategoryModel } from "@/models/Category";
import type { ICategory } from "@/models/Product";

type Props = {
	params: { locale: string };
};

export default async function HomePage({ params: { locale } }: Props) {
	setRequestLocale(locale);

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

	const categories = await getCategories();

	return <LandingPage categories={categories} />;
}
