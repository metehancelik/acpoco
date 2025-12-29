import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { generateOrdersPDF } from "@/lib/pdf-generator";
import Order from "@/models/Order";
import Store from "@/models/Store";

interface OrderQuery {
	"advancedOptions.storeId"?: { $in: number[] };
	"billTo.name"?: { $regex: string; $options: string };
	createDate?: { $gte?: Date; $lte?: Date };
	status?: string | { $ne: string };
	$or?: Array<{
		sku?: { $regex: string; $options: string };
		productName?: { $regex: string; $options: string };
		"billTo.name"?: { $regex: string; $options: string };
	}>;
	shopName?: { $regex: string; $options: string };
	sku?: { $regex: string; $options: string };
	warehouse?: { $regex: string; $options: string };
}

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		let stores = [];

		if (session.user.role === "ADMIN") {
			stores = await Store.find();
		} else {
			stores = await Store.find({ userId: session.user.id });
		}

		const storeIds = stores.map((store) => store.storeId);
		const { searchParams } = new URL(request.url);

		// Parse query parameters
		const storeId = searchParams.get("storeId");
		const customerName = searchParams.get("customerName");
		const orderDateStart = searchParams.get("orderDateStart");
		const orderDateEnd = searchParams.get("orderDateEnd");
		const status = searchParams.get("status");
		const searchTerm = searchParams.get("searchTerm");
		const shopName = searchParams.get("shopName");
		const sku = searchParams.get("sku");
		const warehouse = searchParams.get("warehouse");

		// Build query
		const query: OrderQuery = {
			"advancedOptions.storeId": { $in: storeId ? [+storeId] : storeIds },
		};

		if (customerName) {
			query["billTo.name"] = { $regex: customerName, $options: "i" };
		}

		if (searchTerm) {
			query.$or = [
				{ sku: { $regex: searchTerm, $options: "i" } },
				{ productName: { $regex: searchTerm, $options: "i" } },
				{ "billTo.name": { $regex: searchTerm, $options: "i" } },
			];
		}

		if (status) {
			query.status = status;
		}

		if (shopName) {
			query.shopName = { $regex: shopName, $options: "i" };
		}

		if (sku) {
			query.sku = { $regex: sku, $options: "i" };
		}

		if (warehouse) {
			query.warehouse = { $regex: warehouse, $options: "i" };
		}

		if (orderDateStart || orderDateEnd) {
			query.createDate = {
				...(orderDateStart && { $gte: new Date(orderDateStart) }),
				...(orderDateEnd && { $lte: new Date(orderDateEnd) }),
			};
		}

		const ordersQuery = Order.find(query)
			.sort({ createdAt: -1 })
			.populate([
				{
					path: "advancedOptions.storeId",
					model: "Store",
					localField: "advancedOptions.storeId",
					foreignField: "storeId",
				},
				{
					path: "items.matchId",
					model: "ProductVariant",
					populate: {
						path: "productId",
						model: "Product",
						select: "images",
					},
				},
			]);

		const orders = await ordersQuery;

		if (!orders || orders.length === 0) {
			return NextResponse.json({ error: "No orders found" }, { status: 404 });
		}

		// Generate PDF
		const pdfBuffer = await generateOrdersPDF(orders);

		// Update order statuses to 'processing'
		await Order.updateMany(
			{ _id: { $in: orders.map((order) => order._id) } },
			{ $set: { status: "processing" } },
		);

		// Return PDF as response
		return new Response(pdfBuffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": 'attachment; filename="order_items.pdf"',
				"Content-Length": pdfBuffer.length.toString(),
			},
		});
	} catch (error) {
		console.error("Error generating PDF:", error);

		return NextResponse.json(
			{ error: "Failed to generate PDF" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const { orderIds } = body;

		if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
			return NextResponse.json(
				{ error: "orderIds array is required" },
				{ status: 400 },
			);
		}

		// Find orders by IDs
		const orders = await Order.find({
			_id: { $in: orderIds },
		}).populate([
			{
				path: "advancedOptions.storeId",
				model: "Store",
				localField: "advancedOptions.storeId",
				foreignField: "storeId",
			},
			{
				path: "items.matchId",
				model: "ProductVariant",
				populate: {
					path: "productId",
					model: "Product",
					select: "images",
				},
			},
		]);

		if (!orders || orders.length === 0) {
			return NextResponse.json({ error: "No orders found" }, { status: 404 });
		}

		// Generate PDF
		const pdfBuffer = await generateOrdersPDF(orders);

		// Update order statuses to 'processing'
		await Order.updateMany(
			{ _id: { $in: orderIds } },
			{ $set: { status: "processing" } },
		);

		// Return PDF as response
		return new Response(pdfBuffer, {
			headers: {
				"Content-Type": "application/pdf",
				"Content-Disposition": 'attachment; filename="selected_orders.pdf"',
				"Content-Length": pdfBuffer.length.toString(),
			},
		});
	} catch (error) {
		console.error("Error generating PDF:", error);

		return NextResponse.json(
			{ error: "Failed to generate PDF" },
			{ status: 500 },
		);
	}
}
