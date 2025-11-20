import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import {
	fetchShipStationOrders,
	syncOrderToDatabase,
} from "@/lib/shipstation/client";

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const userId = session.user?.id;

	try {
		const { orders } = await fetchShipStationOrders(userId);

		const syncResults = [];

		for (const order of orders) {
			try {
				await syncOrderToDatabase(order);
				syncResults.push({
					orderId: order.orderId,
					success: true,
				});
			} catch (error) {
				syncResults.push({
					orderId: order.orderId,
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		const successCount = syncResults.filter((result) => result.success).length;
		const failureCount = syncResults.filter((result) => !result.success).length;

		return NextResponse.json({
			success: true,
			message: `Processed ${orders.length} orders`,
			summary: {
				total: orders.length,
				successful: successCount,
				failed: failureCount,
			},
			results: syncResults,
		});
	} catch (error) {
		return NextResponse.json(
			{
				success: false,
				message: "Failed to process orders",
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
