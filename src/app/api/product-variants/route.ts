import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/log-error";
import { ProductVariantModel } from "@/models/ProductVariant";

export async function GET(req: Request) {
	try {
		const { searchParams } = new URL(req.url);
		const productId = searchParams.get("productId");

		if (!productId) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 },
			);
		}

		const variants = await ProductVariantModel.find({ productId });

		return NextResponse.json({ variants });
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const productVariantIds = req.json();

	const productVariants = await ProductVariantModel.find({
		_id: { $in: productVariantIds },
	}).populate("productId", "images title");

	return NextResponse.json(productVariants);
}
