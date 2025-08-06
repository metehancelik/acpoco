import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import DepositRequest from "@/models/DepositRequest";
import Wallet from "@/models/Wallet";
import WalletLog from "@/models/WalletLog";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const updates = { ...body };

    const depositReq = await DepositRequest.findOneAndUpdate(
      { _id: params.id },
      { $set: updates },
      { new: true },
    );

    const wallet = await Wallet.findOne({ userId: depositReq.requestedBy });

    if (!depositReq) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (updates.status === "APPROVED") {
      // await User.updateOne(
      //   { _id: depositReq.requestedBy },
      //   { balance: user.balance + depositReq.requestedAmount },
      // );

      await Wallet.updateOne(
        { userId: depositReq.requestedBy },
        { $inc: { balance: +depositReq.requestedAmount } },
      );
      await WalletLog.create({
        userId: depositReq.requestedBy,
        changeAmount: depositReq.requestedAmount,
        currentBalance: wallet.balance,
        finalBalance: wallet.balance + depositReq.requestedAmount,
        type: "DEPOSIT",
        changedBy: session.user.id,
      });
    }

    return NextResponse.json(depositReq);
  } catch (error) {
    console.error("Error updating deposit:", error);

    return NextResponse.json(
      { error: "Failed to update deposit" },
      { status: 500 },
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = await Wallet.findOne({ userId: params.id });

  return NextResponse.json(wallet);
}
