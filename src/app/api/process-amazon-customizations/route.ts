import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { processAllAmazonCustomizations } from "@/lib/customization";

export async function POST() {
	try {
		const session = await getServerSession(authOptions);

		if (!session || session.user.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const result = await processAllAmazonCustomizations();

		return NextResponse.json({
			success: true,
			message: "Amazon customizations processed successfully",
			result,
		});
	} catch (error) {
		console.error("Error processing Amazon customizations:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Failed to process Amazon customizations",
				details: error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 },
		);
	}
}
