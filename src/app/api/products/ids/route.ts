import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import Product from "@/models/Product";

export async function GET(request: NextRequest) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { searchParams } = new URL(request.url);
		const category = searchParams.get("category");
		const query = searchParams.get("query");

		await dbConnect();

		// biome-ignore lint/suspicious/noExplicitAny: mongoose filter
		const filter: Record<string, any> = {};
		if (category) filter.category = category;
		if (query?.trim()) {
			const regex = new RegExp(query.trim(), "i");
			filter.$or = [
				{ title: { $regex: regex } },
				{ parentSku: { $regex: regex } },
			];
		}

		const products = await Product.find(filter).select("_id").lean();
		const ids = products.map((p) => String(p._id));

		return NextResponse.json({ ids, total: ids.length });
	} catch (error) {
		logError(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
