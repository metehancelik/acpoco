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

	const { shippingPriceRate } = await request.json();

	const user = await User.findByIdAndUpdate(params.id, {
		shippingPriceRate: shippingPriceRate,
	});

	return NextResponse.json(user);
}
