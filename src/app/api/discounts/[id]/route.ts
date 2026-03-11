import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import { DiscountModel } from "@/models/Discount";

export async function DELETE(
	_req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		// We can either set isActive to false or delete the document
		// Let's set isActive to false to maintain history
		const discount = await DiscountModel.findByIdAndUpdate(params.id, {
			isActive: false,
		});

		if (!discount) {
			return NextResponse.json(
				{ error: "Discount not found" },
				{ status: 404 },
			);
		}

		return NextResponse.json({ message: "Discount deactivated successfully" });
	} catch (error) {
		logError(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
