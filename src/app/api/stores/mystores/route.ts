import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Store from "@/models/Store";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session || !session.user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const userId = session.user.id;
		if (session?.user.role === "ADMIN") {
			const stores = await Store.find({}).populate("userId");

			return NextResponse.json({ stores });
		} else {
			const stores = await Store.find({ userId }).populate("userId");

			return NextResponse.json({ stores });
		}
	} catch (error) {
		console.error("Error fetching stores:", error);

		return NextResponse.json(
			{ error: "Failed to fetch stores" },
			{ status: 500 },
		);
	}
}
