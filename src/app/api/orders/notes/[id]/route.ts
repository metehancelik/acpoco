import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { logError } from "@/lib/log-error";
import Order from "@/models/Order";

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const { internalNotes } = await request.json();
		const { id } = params;

		if (!id) {
			return NextResponse.json(
				{ error: "Order ID is required" },
				{ status: 400 },
			);
		}

		const order = await Order.findByIdAndUpdate(
			id,
			{ internalNotes },
			{ new: true },
		);

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json(order);
	} catch (error) {
		logError(error);

		return NextResponse.json(
			{ error: "Failed to update order notes" },
			{ status: 500 },
		);
	}
}
