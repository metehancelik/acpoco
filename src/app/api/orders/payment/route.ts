import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import type { PopulatedShipStationOrderItem } from "@/lib/shipstation/types";
import { adjustInventoryBySku } from "@/lib/shopify";
import { LogModel } from "@/models/Logs";
import Order from "@/models/Order";
import Wallet from "@/models/Wallet";
import WalletLog from "@/models/WalletLog";

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { orderId } = await request.json();

	if (!orderId) {
		return NextResponse.json({ error: "Sipariş bulunamadı" }, { status: 400 });
	}

	const userId = session?.user?.id;

	const userWallet = await Wallet.findOne({ userId });

	if (!userWallet) {
		return NextResponse.json(
			{ error: "Kullanıcı cüzdanı bulunamadı" },
			{ status: 400 },
		);
	}

	try {
		const order = await Order.findById(orderId).populate("items.matchId");

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}
		const totalPrice = order.items.reduce(
			(acc: number, item: PopulatedShipStationOrderItem) => {
				return acc + (item.matchedPrice || 0) * item.quantity;
			},
			0,
		);

		if (totalPrice > userWallet.balance) {
			return NextResponse.json({ error: "Bakiye yetersiz" }, { status: 400 });
		}

		await Wallet.updateOne({ userId }, { $inc: { balance: -totalPrice } });

		await WalletLog.create({
			userId,

			type: "WITHDRAW",
			orderId,
			info: "orderPayment",
			changedBy: userId,
			changeAmount: totalPrice,
			currentBalance: userWallet.balance,
			finalBalance: userWallet.balance - totalPrice,
		});

		order.status = "waitingProduction";
		order.isPayed = true;
		await order.save();

		// Decrease Shopify inventory for matched variants
		try {
			const results = await Promise.all(
				// biome-ignore lint/suspicious/noExplicitAny: fix later
				order.items.map(async (item: any) => {
					const childSku: string | undefined = item?.matchId?.childSku;
					const quantity: number = item?.quantity || 0;
					if (!childSku || !quantity) return null;
					const res = await adjustInventoryBySku(childSku, -quantity);
					return { sku: childSku, quantity, ...res };
				}),
			);
			const failures = (results || []).filter((r) => r && r.ok === false);
			if (failures.length > 0) {
				await LogModel.create({
					message: "Shopify inventory adjust failed for some items",
					level: "warn",
					meta: { orderId, failures },
				});
			}
		} catch (err) {
			await LogModel.create({
				message: "Shopify inventory adjust error",
				level: "error",
				meta: { orderId, error: (err as Error).message },
			});
		}

		return NextResponse.json({ message: "Order paid" }, { status: 200 });
	} catch (error) {
		console.error("Error paying order:", error);

		return NextResponse.json({ error: "Order not found" }, { status: 404 });
	}
}
