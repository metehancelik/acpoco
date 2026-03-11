import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import { DiscountModel } from "@/models/Discount";
import User from "@/models/User";

export async function GET(_req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ discounts: [] });
		}

		await dbConnect();

		const user = await User.findOne({ email: session.user?.email });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Fetch ALL active discounts that COULD apply to this user
		// (User-level, Category-level, or Product-level)
		const discounts = await DiscountModel.find({
			isActive: true,
			$or: [
				{ "scope.userId": user._id },
				{ "scope.type": "category" },
				{ "scope.type": "product" },
			],
		});

		return NextResponse.json({ discounts });
	} catch (error) {
		logError(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
