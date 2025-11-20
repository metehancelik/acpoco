import { type NextRequest, NextResponse } from "next/server";

import { fetchAmazonCustomizationData } from "@/lib/shipstation/amazon-customization";

export async function POST(request: NextRequest) {
	try {
		const { customizedUrl } = await request.json();

		if (!customizedUrl) {
			return NextResponse.json(
				{ error: "Customized URL is required" },
				{ status: 400 },
			);
		}

		const customizationData = await fetchAmazonCustomizationData(customizedUrl);

		if (!customizationData) {
			return NextResponse.json(
				{ error: "Failed to fetch customization data" },
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			data: customizationData.customizationData,
			rawJson: customizationData.rawJson,
		});
	} catch (error) {
		console.error("Error in Amazon customization API:", error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
