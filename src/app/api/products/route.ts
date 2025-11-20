import type { PipelineStage } from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

function createTurkishRegexPattern(query: string) {
	const turkishChars: { [key: string]: string } = {
		a: "[aâ]",
		e: "[eê]",
		i: "[iİıî]",
		o: "[oö]",
		u: "[uüû]",
		s: "[sş]",
		c: "[cç]",
		g: "[gğ]",
	};

	return query
		.toLowerCase()
		.split("")
		.map((char) => turkishChars[char] || char)
		.join("");
}

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const query = searchParams.get("query") || undefined;
	const page = Number(searchParams.get("page")) || 1;
	const limit = Number(searchParams.get("limit")) || 20;

	const pipeline: PipelineStage[] = [
		{
			$lookup: {
				from: "categories",
				localField: "category",
				foreignField: "_id",
				as: "category",
			},
		},
		{ $unwind: "$category" },
	];

	if (query) {
		const pattern = createTurkishRegexPattern(query);
		pipeline.push({
			$match: {
				$or: [
					{ title: { $regex: pattern, $options: "i" } },
					{ "category.name": { $regex: pattern, $options: "i" } },
				],
			},
		});
	}

	pipeline.push({ $skip: (page - 1) * limit }, { $limit: limit });

	const products = await Product.aggregate(pipeline);

	const countPipeline: PipelineStage[] = pipeline.slice(0, -2);
	countPipeline.push({ $count: "total" });
	const [countResult] = await Product.aggregate(countPipeline);
	const total = countResult?.total || 0;

	return NextResponse.json({ products, total });
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const body = await request.json();
		const {
			parentSku,
			title,
			price,
			description,
			weight,
			dimensions,
			images,
			attributes,
			category,
			estimatedProductionTime,
			variants,
		} = body;

		// Create the main product
		const product = new Product({
			parentSku,
			title,
			price,
			description,
			weight,
			dimensions,
			images,
			attributes,
			category,
			estimatedProductionTime,
		});

		const savedProduct = await product.save();

		// Create variants if provided
		if (variants && variants.length > 0) {
			const variantPromises = variants.map(
				(variant: {
					childSku: string;
					price: number;
					attributes: { name: string; value: string }[];
					stock?: number;
				}) => {
					const productVariant = new ProductVariantModel({
						productId: savedProduct._id,
						childSku: variant.childSku,
						price: variant.price,
						attributes: variant.attributes,
						stock: variant.stock || 0,
					});

					return productVariant.save();
				},
			);

			await Promise.all(variantPromises);
		}

		return NextResponse.json({
			success: true,
			product: savedProduct,
			message: "Product created successfully",
		});
	} catch (error) {
		console.error("Error creating product:", error);

		return NextResponse.json(
			{ error: "Failed to create product" },
			{ status: 500 },
		);
	}
}
