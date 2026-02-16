import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import BillingAddress from "@/models/BillingAddress";

export async function GET() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.id) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const billingAddress = await BillingAddress.findOne({
		userId: session.user.id,
	})
		.lean()
		.exec();

	return NextResponse.json(billingAddress ?? null);
}
