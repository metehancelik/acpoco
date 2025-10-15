import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Wallet from "@/models/Wallet";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const wallet = await Wallet.findOne({ userId: session.user.id });

  return NextResponse.json(wallet, { status: 200 });
}
