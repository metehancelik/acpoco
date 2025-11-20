import path from "node:path";

import { NextResponse } from "next/server";

import { importProductsFromCSV } from "@/lib/importProducts";

export async function GET() {
	try {
		const filePath = path.join(process.cwd(), "src", "data", "data.csv");
		const result = await importProductsFromCSV(filePath);

		if (!result.success) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json(result);
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";

		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
