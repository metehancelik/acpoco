import { type NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import type { IProduct } from "@/models/Product";
import Product from "@/models/Product";

const ITEMS_PER_PAGE = 24;

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const page = Math.max(1, Number(searchParams.get("page") ?? 1));
		const category = searchParams.get("category") ?? undefined;
		const query = searchParams.get("query") ?? undefined;

		await dbConnect();

		// biome-ignore lint/suspicious/noExplicitAny: mongoose filter
		const filter: Record<string, any> = {};
		if (category) {
			filter.category = category;
		}
		if (query?.trim()) {
			const regex = new RegExp(query.trim(), "i");
			filter.$or = [
				{ title: { $regex: regex } },
				{ parentSku: { $regex: regex } },
			];
		}

		const totalItems = await Product.countDocuments(filter);
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
		const hasNextPage = page < totalPages;
		const skip = (page - 1) * ITEMS_PER_PAGE;

		const products = await Product.find(filter)
			.populate("category")
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(ITEMS_PER_PAGE)
			.lean();

		const data: {
			products: IProduct[];
			hasNextPage: boolean;
			nextPage: number | null;
			page: number;
		} = {
			products: JSON.parse(JSON.stringify(products)),
			hasNextPage,
			nextPage: hasNextPage ? page + 1 : null,
			page,
		};

		return NextResponse.json(data);
	} catch (error) {
		console.error("Error fetching products:", error);
		return NextResponse.json(
			{
				products: [],
				hasNextPage: false,
				nextPage: null,
				page: 1,
			},
			{ status: 500 },
		);
	}
}
