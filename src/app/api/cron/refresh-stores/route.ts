import { type NextRequest, NextResponse } from "next/server";

import { getStores, refreshStore } from "@/lib/shipstation/client";
import { LogModel } from "@/models/Logs";

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
	if (!isAuthorized(req)) {
		return NextResponse.json(
			{ success: false, error: "Unauthorized" },
			{ status: 401 },
		);
	}

	const summary = {
		totalStations: 0,
		successful: 0,
		failed: 0,
		details: [] as Array<{
			storeId: number;
			storeName: string;
			success: boolean;
			error?: string;
		}>,
	};

	try {
		const stores = await getStores();
		summary.totalStations = stores.length;

		for (const store of stores) {
			try {
				await refreshStore(store.storeId);
				summary.successful += 1;
				summary.details.push({
					storeId: store.storeId,
					storeName: store.storeName,
					success: true,
				});
			} catch (error) {
				summary.failed += 1;
				summary.details.push({
					storeId: store.storeId,
					storeName: store.storeName,
					success: false,
					error: error instanceof Error ? error.message : "Unknown error",
				});
			}
		}

		await new LogModel({
			message: "Cron ShipStation store refresh completed",
			level: "info",
			meta: {
				summary,
				timestamp: new Date().toISOString(),
			},
		}).save();

		return NextResponse.json({
			success: true,
			summary,
		});
	} catch (error) {
		console.error("Cron ShipStation store refresh fatal error:", error);
		await new LogModel({
			message: "Cron ShipStation store refresh fatal error",
			level: "error",
			meta: {
				error: error instanceof Error ? error.message : error,
				timestamp: new Date().toISOString(),
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
