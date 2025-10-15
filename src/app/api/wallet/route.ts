import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import DepositRequest from "@/models/DepositRequest";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await request.json();

    await DepositRequest.create({
      ...body,
      requestedBy: userId,
    });

    return NextResponse.json(
      { message: "Deposit created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error create deposit", error);

    return NextResponse.json(
      { error: "Failed to create deposit" },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams;
  const skip = 20 * (parseInt(query.get("page") || "1") - 1);
  const limit = 20;
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const queryObject: { requestedBy?: string | null } = {};
  if (session.user.role !== "ADMIN") {
    queryObject.requestedBy = session.user.id;
  }

  if (query.get("requestedBy")) {
    queryObject.requestedBy = query.get("requestedBy");
  }

  try {
    const deposits = await DepositRequest.find(queryObject)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("requestedBy", "name email");

    return NextResponse.json(deposits);
  } catch (error) {
    console.error("Error getting deposits", error);

    return NextResponse.json(
      { error: "Failed to get deposits" },
      { status: 500 },
    );
  }
}
