import { NextResponse } from "next/server";

import { Wallet } from "@/models";
import User from "@/models/User";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, surname, email, password } = body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 },
      );
    }

    const res = await User.create({ name, surname, email, password });

    await Wallet.create({
      userId: res._id,
      balance: 0,
    });

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);

    return NextResponse.json(
      { message: "An error occurred during registration" },
      { status: 500 },
    );
  }
}
