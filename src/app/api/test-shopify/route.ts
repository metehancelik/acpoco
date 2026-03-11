import { NextResponse } from "next/server";

import { logError } from "@/lib/log-error";
import { fetchProducts, testShopifyConnection } from "@/utils/shopify";

export async function GET() {
	try {
		// Test basic connection
		const connectionTest = await testShopifyConnection();
		if (!connectionTest) {
			return NextResponse.json(
				{
					success: false,
					error: "Failed to connect to Shopify",
				},
				{ status: 500 },
			);
		}

		// Test fetching products
		const productsTest = await fetchProducts({ first: 5 });

		return NextResponse.json({
			success: true,
			message: "Shopify connection successful",
			data: {
				connectionTest: true,
				productsCount: productsTest.products.edges.length,
				sampleProducts: productsTest.products.edges.map((edge) => ({
					id: edge.node.id,
					title: edge.node.title,
					handle: edge.node.handle,
					status: edge.node.status,
				})),
			},
		});
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
				details: error,
			},
			{ status: 500 },
		);
	}
}
