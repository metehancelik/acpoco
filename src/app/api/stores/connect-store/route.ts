import { type NextRequest, NextResponse } from "next/server";

import { Store } from "@/models";

export async function POST(request: NextRequest) {
	const { shopId, userId } = await request.json();

	const store = await Store.findById(shopId);
	if (!store) {
		return NextResponse.json({ message: "Store not found" }, { status: 404 });
	}

	store.userId = userId;
	await store?.save();

	return NextResponse.json({ message: "Store connected" });
}
