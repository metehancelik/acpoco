import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import Product from "@/models/Product";
import User from "@/models/User";

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { productId } = await req.json();

		if (!productId) {
			return NextResponse.json(
				{ error: "Product ID is required" },
				{ status: 400 },
			);
		}

		const user = await User.findOne({ email: session.user?.email });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Check if product is already in favorites
		if (user.favorites.includes(productId)) {
			return NextResponse.json(
				{ error: "Product already in favorites" },
				{ status: 400 },
			);
		}

		// Add product to favorites
		user.favorites.push(productId);
		await user.save();

		return NextResponse.json(
			{ message: "Product added to favorites" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error adding favorite:", error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET() {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await User.findOne({ email: session.user?.email });

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	const favorites = await Product.find({ _id: { $in: user.favorites } });

	return NextResponse.json({ favorites }, { status: 200 });
}

export async function DELETE(req: Request) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { productId } = await req.json();

	if (!productId) {
		return NextResponse.json(
			{ error: "Product ID is required" },
			{ status: 400 },
		);
	}

	const user = await User.findOne({ email: session.user?.email });

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}

	user.favorites = user.favorites.filter(
		(id: string) => id.toString() !== productId,
	);
	await user.save();

	return NextResponse.json(
		{ message: "Product removed from favorites" },
		{ status: 200 },
	);
}
