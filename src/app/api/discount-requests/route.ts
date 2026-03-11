import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import "@/models/Category";

import { DiscountRequestModel } from "@/models/DiscountRequest";
import "@/models/ProductVariant";

import { logError } from "@/lib/log-error";
import User from "@/models/User";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		const user = await User.findOne({ email: session.user?.email });
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		const body = await req.json();
		const { items, message } = body;

		if (!items || !Array.isArray(items) || items.length === 0) {
			return NextResponse.json(
				{ error: "Items are required" },
				{ status: 400 },
			);
		}

		const discountRequest = await DiscountRequestModel.create({
			userId: user._id,
			items: items.map(
				(item: {
					variantId?: string;
					productId: string;
					quantity: number;
				}) => ({
					variantId: item.variantId,
					productId: item.productId,
					quantity: item.quantity,
				}),
			),
			message,
			status: "pending",
		});

		return NextResponse.json(discountRequest, { status: 201 });
	} catch (error) {
		logError(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		const { searchParams } = new URL(req.url);
		const mode = searchParams.get("mode"); // "user" or "admin"

		if (mode === "admin") {
			if (session.user?.role !== "ADMIN") {
				return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
			}
			const requests = await DiscountRequestModel.find()
				.populate("userId", "name surname email")
				.populate({
					path: "items.productId",
					select: "title images category",
					populate: { path: "category", select: "name" },
				})
				.populate("items.variantId", "childSku attributes price")
				.sort({ createdAt: -1 });
			return NextResponse.json(requests);
		} else {
			// Default to current user's requests
			const user = await User.findOne({ email: session.user?.email });
			if (!user) {
				return NextResponse.json({ error: "User not found" }, { status: 404 });
			}

			const requests = await DiscountRequestModel.find({ userId: user._id })
				.populate("items.productId", "title images")
				.populate("items.variantId", "childSku attributes price")
				.sort({ createdAt: -1 });
			return NextResponse.json(requests);
		}
	} catch (error) {
		logError(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
