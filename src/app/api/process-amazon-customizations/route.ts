import { NextResponse } from "next/server";

import { processAllAmazonCustomizations } from "@/lib/shipstation/process-all-amazon-customizations";

export async function POST() {
  try {
    const result = await processAllAmazonCustomizations();

    return NextResponse.json({
      success: true,
      message: "Amazon customization processing completed",
      result,
    });
  } catch (error) {
    console.error("Error in process Amazon customizations API:", error);

    return NextResponse.json(
      {
        error: "Processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
