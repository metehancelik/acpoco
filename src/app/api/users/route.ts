import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { User } from "@/models/index";

export async function GET(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const { searchParams } = new URL(request.url);
	const page = parseInt(searchParams.get("page") || "1", 10);

	const users = await User.aggregate([
		{ $skip: (page - 1) * 20 },
		{ $limit: 20 },
		{
			$lookup: {
				from: "stores",
				localField: "stores",
				foreignField: "_id",
				as: "stores",
			},
		},
		{
			$lookup: {
				from: "wallets",
				localField: "_id",
				foreignField: "userId",
				as: "wallet",
			},
		},
		{
			$addFields: {
				balance: { $ifNull: [{ $arrayElemAt: ["$wallet.balance", 0] }, 0] },
			},
		},
		{
			$project: {
				wallet: 0,
				password: 0,
			},
		},
	]);

	return NextResponse.json(users);
}

export async function POST(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		await User.create(body);

		return NextResponse.json(
			{ message: "User created successfully" },
			{ status: 201 },
		);
	} catch (error) {
		console.error("Error creating user:", error);

		return NextResponse.json(
			{ error: "Failed to create user" },
			{ status: 500 },
		);
	}
}

export async function PUT(request: Request) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const id = session.user?.id;
	try {
		const body = await request.json();
		const { name, surname } = body;
		await User.findByIdAndUpdate(id, { name, surname });

		return NextResponse.json(
			{ message: "User updated successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error updating user:", error);

		return NextResponse.json(
			{ error: "Failed to update user" },
			{ status: 500 },
		);
	}
}
