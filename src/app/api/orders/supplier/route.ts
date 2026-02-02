import type { Types } from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";
import Store from "@/models/Store";
import Wallet from "@/models/Wallet";
import WalletLog from "@/models/WalletLog";

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

interface OrderWithFees {
	_id: Types.ObjectId;
	orderId: number;
	warehousePrice?: number;
	shippingAmount?: number;
	advancedOptions: {
		storeId: number;
	};
}

// Helper function to deduct shipping fees from users' wallets
async function deductShippingFees(
	orders: OrderWithFees[],
	adminUserId: string,
) {
	// Get unique store IDs from orders
	const storeIdsSet = new Set(orders.map((o) => o.advancedOptions?.storeId));
	const storeIds = Array.from(storeIdsSet);

	// Get stores with their user IDs
	const stores = await Store.find({ storeId: { $in: storeIds } });
	const storeToUserMap: Record<number, string> = {};
	for (const store of stores) {
		storeToUserMap[store.storeId] = store.userId.toString();
	}

	// Group orders by user and calculate total fees
	const userFees: Record<
		string,
		{ totalFees: number; orderIds: Types.ObjectId[] }
	> = {};
	for (const order of orders) {
		const userId = storeToUserMap[order.advancedOptions?.storeId];
		if (!userId) continue;

		const warehousePrice = order.warehousePrice || 0;
		const shippingAmount = order.shippingAmount || 0;
		const orderFees = warehousePrice + shippingAmount;

		if (orderFees > 0) {
			if (!userFees[userId]) {
				userFees[userId] = { totalFees: 0, orderIds: [] };
			}
			userFees[userId].totalFees += orderFees;
			userFees[userId].orderIds.push(order._id);
		}
	}

	// Deduct fees from each user's wallet
	const userEntries = Object.entries(userFees);
	for (const [userId, { totalFees, orderIds }] of userEntries) {
		const userWallet = await Wallet.findOne({ userId });
		if (!userWallet) {
			console.warn(`Wallet not found for user ${userId}, skipping fee deduction`);
			continue;
		}

		// Deduct from wallet
		await Wallet.updateOne({ userId }, { $inc: { balance: -totalFees } });

		// Create wallet log
		await WalletLog.create({
			userId,
			type: "WITHDRAW",
			info: "shippingFees",
			changedBy: adminUserId,
			changeAmount: totalFees,
			currentBalance: userWallet.balance,
			finalBalance: userWallet.balance - totalFees,
		});

		// Mark orders as fees deducted
		await Order.updateMany(
			{ _id: { $in: orderIds } },
			{ $set: { shippingFeesDeducted: true } },
		);
	}
}

export async function PATCH(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { orderIds, changedStatus, isAllSelected } = await request.json();

	const { searchParams } = new URL(request.url);
	const storeId = searchParams.get("storeId");
	const customerName = searchParams.get("customerName");
	const orderDateStart = searchParams.get("orderDateStart");
	const orderDateEnd = searchParams.get("orderDateEnd");
	const status = searchParams.get("status");

	const searchTerm = searchParams.get("searchTerm");
	const shopName = searchParams.get("shopName");
	const sku = searchParams.get("sku");
	const warehouse = searchParams.get("warehouse");
	try {
		const stores = await Store.find({ userId: session.user.id });
		const storeIds = stores.map((store) => store.storeId);
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
		} else if (session.user.role === "ADMIN" && !status) {
			query.status = { $ne: "waitingPayment" };
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

		// If changing to "shipped", deduct shipping fees from users' wallets
		if (changedStatus === "shipped") {
			let ordersToUpdate: OrderWithFees[];

			if (isAllSelected) {
				// Get all orders matching the query that haven't had fees deducted yet
				ordersToUpdate = await Order.find({
					...query,
					shippingFeesDeducted: { $ne: true },
				}).select("_id orderId warehousePrice shippingAmount advancedOptions");
			} else {
				// Get specific orders that haven't had fees deducted yet
				ordersToUpdate = await Order.find({
					_id: { $in: orderIds },
					shippingFeesDeducted: { $ne: true },
				}).select("_id orderId warehousePrice shippingAmount advancedOptions");
			}

			// Deduct fees from users' wallets
			if (ordersToUpdate.length > 0) {
				await deductShippingFees(ordersToUpdate, session.user.id);
			}
		}

		if (isAllSelected) {
			await Order.updateMany(query, { $set: { status: changedStatus } });

			return NextResponse.json(
				{ message: "Siparişler güncellendi" },
				{ status: 200 },
			);
		} else {
			await Order.updateMany(
				{ _id: { $in: orderIds } },
				{ $set: { status: changedStatus } },
			);

			return NextResponse.json(
				{ message: "Siparişler güncellendi" },
				{ status: 200 },
			);
		}
	} catch (error) {
		throw new Error(error as string);
	}
}
