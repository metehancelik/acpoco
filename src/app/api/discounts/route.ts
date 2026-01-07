import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { DiscountModel } from "@/models/Discount";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		const body = await req.json();
		const { percentage, scopeType, userId, categoryId, variantId, expiresAt } =
			body;

		if (!percentage) {
			return NextResponse.json(
				{ error: "Percentage is required" },
				{ status: 400 },
			);
		}

		const scope: {
			type: "user" | "category" | "variant";
			userId?: string;
			categoryId?: string;
			variantId?: string;
		} = { type: scopeType };
		if (scopeType === "user") scope.userId = userId;
		if (scopeType === "category") scope.categoryId = categoryId;
		if (scopeType === "variant") scope.variantId = variantId;

		const discount = await DiscountModel.create({
			percentage,
			scope,
			createdBy: session.user.id,
			isActive: true,
			expiresAt: expiresAt ? new Date(expiresAt) : undefined,
		});

		return NextResponse.json(discount, { status: 201 });
	} catch (error) {
		console.error("Error creating discount:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();
		const { searchParams } = new URL(req.url);
		const userId = searchParams.get("userId");

		const query: Record<string, unknown> = { isActive: true };
		if (userId) {
			query["scope.userId"] = userId;
		}

		const discounts = await DiscountModel.find(query).sort({ createdAt: -1 });
		return NextResponse.json(discounts);
	} catch (error) {
		console.error("Error fetching discounts:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
