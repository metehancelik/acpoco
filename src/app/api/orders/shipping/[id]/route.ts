import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";

export async function PATCH(
	req: NextRequest,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);

	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	if (session.user.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const { trackingNumber, shippingService, warehousePrice, shippingAmount } =
		await req.json();

	const order = await Order.findById(params.id);
	if (!order) {
		return NextResponse.json({ error: "Order not found" }, { status: 404 });
	}

	const hasUploadedFile =
		Boolean(order.labelUrl) ||
		order.items?.some((item: { designUrl?: string }) => item.designUrl);
	if (
		hasUploadedFile &&
		(warehousePrice !== undefined || shippingAmount !== undefined)
	) {
		return NextResponse.json(
			{
				error:
					"Warehouse/shipping fees are locked because a file has been uploaded for this order.",
			},
			{ status: 400 },
		);
	}

	if (trackingNumber !== undefined) {
		order.warehouseTrackingNumber = trackingNumber;
	}
	if (shippingService !== undefined) {
		order.warehouseShippingService = shippingService;
	}
	if (warehousePrice !== undefined) {
		order.warehousePrice = warehousePrice;
	}
	if (shippingAmount !== undefined) {
		order.shippingAmount = shippingAmount;
	}
	await order.save();

	return NextResponse.json(order);
}
