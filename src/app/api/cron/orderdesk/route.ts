import { NextResponse } from "next/server";

import {
  fetchShipStationOrders,
  syncOrderToDatabase,
} from "@/lib/shipstation/client";

interface SyncResult {
  orderId: number;
  success: boolean;
  error?: string;
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { orders } = await fetchShipStationOrders();

    const syncResults: SyncResult[] = [];

    for (const order of orders) {
      try {
        await syncOrderToDatabase(order);
        syncResults.push({
          orderId: order.orderId,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to sync order ${order.orderId}:`, error);
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
      message: `Processed ${syncResults.length} orders`,
      summary: {
        total: syncResults.length,
        successful: successCount,
        failed: failureCount,
      },
      results: syncResults,
    });
  } catch (error) {
    console.error("Error in cron job:", error);

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
