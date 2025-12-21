import { type NextRequest, NextResponse } from "next/server";

import {
	fetchShipStationOrdersModifiedSince,
	syncOrderToDatabase,
} from "@/lib/shipstation/client";
import { LogModel } from "@/models/Logs";

type CronRunSummary = {
	totalFetched: number;
	totalProcessed: number;
	successful: number;
	failed: number;
};

function getHoursParam(req: NextRequest): number {
	const hoursRaw = req.nextUrl.searchParams.get("hours");
	const hours = hoursRaw ? Number(hoursRaw) : 2;
	if (!Number.isFinite(hours) || hours <= 0) return 2;
	return Math.min(Math.max(Math.floor(hours), 1), 48);
}

function isAuthorized(req: NextRequest): boolean {
	const secret = process.env.CRON_SECRET;
	if (!secret) return false;

	const headerSecret = req.headers.get("x-cron-secret");
	if (headerSecret && headerSecret === secret) return true;

	const querySecret = req.nextUrl.searchParams.get("secret");
	if (querySecret && querySecret === secret) return true;

	return false;
}

export async function GET(req: NextRequest) {
	if (!process.env.CRON_SECRET) {
		return NextResponse.json(
			{ success: false, error: "CRON_SECRET is not configured" },
			{ status: 500 },
		);
	}

	if (!isAuthorized(req)) {
		return NextResponse.json(
			{ success: false, error: "Unauthorized" },
			{ status: 401 },
		);
	}

	const hours = getHoursParam(req);
	const modifiedSince = new Date(Date.now() - hours * 60 * 60 * 1000);

	const startedAt = new Date();
	const summary: CronRunSummary = {
		totalFetched: 0,
		totalProcessed: 0,
		successful: 0,
		failed: 0,
	};

	try {
		const { orders, storeIds } = await fetchShipStationOrdersModifiedSince({
			modifiedSince,
		});

		summary.totalFetched = orders.length;

		const results: Array<{
			orderId: number;
			success: boolean;
			error?: string;
		}> = [];
		for (const order of orders) {
			try {
				await syncOrderToDatabase(order);
				summary.successful += 1;
				results.push({ orderId: order.orderId, success: true });
			} catch (error) {
				summary.failed += 1;
				results.push({
					orderId: order.orderId,
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			} finally {
				summary.totalProcessed += 1;
			}
		}

		await new LogModel({
			message: "Cron ShipStation sync completed",
			level: "info",
			meta: {
				hours,
				modifiedSince: modifiedSince.toISOString(),
				startedAt: startedAt.toISOString(),
				endedAt: new Date().toISOString(),
				storeIds,
				summary,
			},
		}).save();

		return NextResponse.json({
			success: true,
			hours,
			modifiedSince: modifiedSince.toISOString(),
			summary,
			results,
		});
	} catch (error) {
		await new LogModel({
			message: "Cron ShipStation sync failed",
			level: "error",
			meta: {
				hours,
				modifiedSince: modifiedSince.toISOString(),
				startedAt: startedAt.toISOString(),
				error: error instanceof Error ? error.message : error,
			},
		}).save();

		return NextResponse.json(
			{
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
