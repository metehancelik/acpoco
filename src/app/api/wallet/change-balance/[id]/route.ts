import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import User from "@/models/User";
import Wallet from "@/models/Wallet";
import WalletLog from "@/models/WalletLog";

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);

		if (session?.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { amount, info, type } = await request.json();

		if (!amount || !info || !type) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		if (type !== "deposit" && type !== "withdraw") {
			return NextResponse.json(
				{ error: "Invalid type. Must be 'deposit' or 'withdraw'" },
				{ status: 400 },
			);
		}

		const user = await User.findById(params.id);

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Calculate new balance based on type
		const balanceChange = type === "deposit" ? Number(amount) : -Number(amount);
		const userWallet = await Wallet.findOne({ userId: params.id });

		if (!userWallet) {
			return NextResponse.json(
				{ error: "User wallet not found" },
				{ status: 404 },
			);
		}

		// Create wallet log
		await WalletLog.create({
			info,
			changeAmount: Number(amount),
			currentBalance: userWallet.balance,
			finalBalance: userWallet.balance + balanceChange,
			userId: params.id,
			type: type.toUpperCase(),
			changedBy: session.user.id,
		});

		// Update user balance
		await Wallet.updateOne(
			{ userId: params.id },
			{ $inc: { balance: balanceChange } },
		);

		return NextResponse.json(
			{ message: "Bakiye Güncellendi" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error changing balance:", error);

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
