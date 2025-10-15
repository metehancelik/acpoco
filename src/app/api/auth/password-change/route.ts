import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const { oldPassword, newPassword, confirmPassword } = body;

    const user = await User.findOne({ _id: session.user.id });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const isValid = user.comparePassword(oldPassword);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }
    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "New passwords do not match" },
        { status: 400 },
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json("Password updated");
  } catch (error) {
    console.error("Error updating deposit:", error);

    return NextResponse.json(
      { error: "Failed to update deposit" },
      { status: 500 },
    );
  }
}
