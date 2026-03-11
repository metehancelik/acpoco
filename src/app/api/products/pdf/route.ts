import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import { generateProductCataloguePDF } from "@/lib/product-catalogue-pdf";
import "@/models/Category";

import { DiscountModel } from "@/models/Discount";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";
import User from "@/models/User";

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const productIds: string[] = body?.productIds;

		if (!Array.isArray(productIds) || productIds.length === 0) {
			return NextResponse.json(
				{ error: "No product IDs provided" },
				{ status: 400 },
			);
		}

		await dbConnect();

		// Fetch products with category populated
		const products = await Product.find({ _id: { $in: productIds } })
			.populate("category")
			.lean();

		// Fetch all variants for these products
		const productIdStrs = products.map((p) => String(p._id));
		const variants = await ProductVariantModel.find({
			productId: { $in: productIdStrs },
		}).lean();

		// Group variants by product id
		const variantsByProductId = new Map<string, typeof variants>();
		for (const v of variants) {
			const id = String(v.productId);
			if (!variantsByProductId.has(id)) variantsByProductId.set(id, []);
			variantsByProductId.get(id)!.push(v);
		}

		// Fetch user discounts
		const user = (await User.findOne({
			email: session.user?.email,
		}).lean()) as { _id: unknown } | null;
		const discounts = user
			? await DiscountModel.find({
					isActive: true,
					$or: [
						{ "scope.userId": user._id },
						{ "scope.type": "category" },
						{ "scope.type": "product" },
					],
				}).lean()
			: [];

		// Build enriched products for PDF
		const productsForPDF = products.map((p) => {
			const id = String(p._id);
			const pvs = variantsByProductId.get(id) ?? [];
			const firstImage = Array.isArray(p.images) ? p.images[0] : undefined;

			return {
				_id: id,
				title: p.title,
				price: p.price,
				images: p.images ?? [],
				parentSku: p.parentSku,
				category: p.category as { _id: string; name: string },
				shopifyData: {
					variants: pvs.map((v) => ({
						id: String(v._id),
						price: String(v.price),
						sku: v.childSku,
						inventoryQuantity: v.stock ?? 0,
						selectedOptions: (
							v.attributes as { name: string; value: string }[]
						).map((a) => ({ name: a.name, value: a.value })),
						image: firstImage ? { url: firstImage } : undefined,
					})),
				},
			};
		});

		// Preserve requested order
		const orderMap = new Map(productIds.map((id, i) => [id, i]));
		productsForPDF.sort(
			(a, b) => (orderMap.get(a._id) ?? 0) - (orderMap.get(b._id) ?? 0),
		);

		const pdfBuffer = await generateProductCataloguePDF(productsForPDF, {
			userId: user ? String((user as { _id: unknown })._id) : session.user.id,
			discounts: discounts as Parameters<
				typeof generateProductCataloguePDF
			>[1]["discounts"],
			exportDate: new Date(),
		});

		return new NextResponse(new Uint8Array(pdfBuffer), {
			status: 200,
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": `attachment; filename="urun-katalogu-${Date.now()}.pdf"`,
				"Cache-Control": "no-store",
			},
		});
	} catch (error) {
		logError(error);
		return NextResponse.json(
			{ error: "PDF generation failed" },
			{ status: 500 },
		);
	}
}
