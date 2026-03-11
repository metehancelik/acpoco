import { type NextRequest, NextResponse } from "next/server";

import { logError } from "@/lib/log-error";
import { ProductVariantModel } from "@/models/ProductVariant";

export async function GET(
	request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const searchParams = request.nextUrl.searchParams;
		const attributes = Object.fromEntries(searchParams.entries());

		// Convert attributes to array of attribute objects
		const attributeArray = Object.entries(attributes).map(([name, value]) => ({
			name,
			value,
		}));

		const variant = await ProductVariantModel.findOne({
			productId: params.id,
			$and: attributeArray.map((attr) => ({
				attributes: {
					$elemMatch: {
						name: attr.name,
						value: attr.value,
					},
				},
			})),
		}).lean();

		if (!variant) {
			return NextResponse.json({ error: "Variant not found" }, { status: 404 });
		}

		return NextResponse.json(variant);
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
