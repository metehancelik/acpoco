import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";
import Store from "@/models/Store";

interface OrderQuery {
	"advancedOptions.storeId"?: { $in: number[] };
	"billTo.name"?: { $regex: string; $options: string };
	createDate?: { $gte?: Date; $lte?: Date };
	status?: string | { $ne: string };
	$or?: {
		sku?: { $regex: string; $options: string };
		productName?: { $regex: string; $options: string };
		"billTo.name"?: { $regex: string; $options: string };
	}[];
	shopName?: { $regex: string; $options: string };
	sku?: { $regex: string; $options: string };
	warehouse?: { $regex: string; $options: string };
	isPayed?: boolean;
}

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	let stores = [];
	try {
		if (session.user.role === "ADMIN") {
			stores = await Store.find();
		} else {
			stores = await Store.find({ userId: session.user.id });
		}

		const storeIds = stores.map((store) => store.storeId);
		const { searchParams } = new URL(request.url);
		const view = searchParams.get("view");
		const storeId = searchParams.get("storeId");
		const customerName = searchParams.get("customerName");
		const orderDateStart = searchParams.get("orderDateStart");
		const orderDateEnd = searchParams.get("orderDateEnd");
		const status = searchParams.get("status");
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "20", 10);
		const skip = (page - 1) * limit;

		const searchTerm = searchParams.get("searchTerm");
		const shopName = searchParams.get("shopName");
		const sku = searchParams.get("sku");
		const warehouse = searchParams.get("warehouse");

		const query: OrderQuery = {
			"advancedOptions.storeId": { $in: storeId ? [+storeId] : storeIds },
		};
		// TODO: Admin'in sadece ödenmiş siparişlerini görmesi gerekiyor.
		if (session.user.role === "ADMIN") {
			query.isPayed = true;
		}

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

		const totalOrders = await Order.countDocuments(query);
		const totalPages = Math.ceil(totalOrders / limit);

		let ordersQuery = Order.find(query)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit);

		if (view === "print") {
			ordersQuery = ordersQuery.populate([
				{
					path: "items.matchId",
					populate: {
						path: "productId",
					},
				},
				{
					path: "advancedOptions.storeId",
					model: "Store",
					localField: "advancedOptions.storeId",
					foreignField: "storeId",
				},
			]);
		} else {
			ordersQuery = ordersQuery.populate({
				path: "items.matchId",
			});
		}

		const orders = await ordersQuery;

		return NextResponse.json({ orders, totalOrders, totalPages, page, limit });
	} catch (error) {
		console.error("Error fetching orders:", error);

		return NextResponse.json(
			{ error: "Failed to fetch orders" },
			{ status: 500 },
		);
	}
}
