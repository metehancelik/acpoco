import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { BillingAddress, User } from "@/models/index";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);

	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const user = await User.findById(params.id).populate("stores");
	const billingAddress = await BillingAddress.findOne({ userId: params.id });

	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}
	user.billingAddress = billingAddress;

	return NextResponse.json(user);
}
