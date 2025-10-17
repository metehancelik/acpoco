import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { User } from "@/models/index";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { discountPercent } = await request.json();

  const normalized = Math.max(0, Math.min(100, Number(discountPercent) || 0));

  const user = await User.findByIdAndUpdate(
    params.id,
    { discountPercent: normalized },
    { new: true },
  );

  return NextResponse.json(user);
}
