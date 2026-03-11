import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/log-error";
import Wallet from "@/models/Wallet";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);

	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const wallet = await Wallet.findOne({ userId: params.id });

		if (!wallet) {
			return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
		}

		return NextResponse.json(wallet);
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{ error: "Failed to get wallet" },
			{ status: 500 },
		);
	}
}
