import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/log-error";
import WalletLog from "@/models/WalletLog";

export async function GET(request: Request) {
	const query = new URL(request.url).searchParams;
	const skip = 20 * (parseInt(query.get("page") || "1", 10) - 1);
	const limit = 20;
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const filter =
		session.user?.role === "ADMIN"
			? {}
			: {
					userId: session.user?.id,
				};

	try {
		const logs = await WalletLog.find(filter)
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.populate("userId")
			.populate("changedBy");
		const count = await WalletLog.countDocuments();
		const totalPages = Math.ceil(count / limit);

		return NextResponse.json({ logs, totalPages });
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{ error: "Failed to get deposits" },
			{ status: 500 },
		);
	}
}
