import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { User } from "@/models";
import BillingAddress from "@/models/BillingAddress";

export async function PUT(request: Request, params: { id: string }) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const userId = session.user?.id;
	const id = params.id;
	try {
		const body = await request.json();
		const {
			title,
			salutation,
			addressLine1,
			addressLine2,
			city,
			country,
			companyName,
			firstName,
			lastName,
			identityNumber,
			gsmNumber,
			taxOffice,
			vatNumber,
			zipCode,
		} = body;
		const filter = id ? { _id: id } : {};
		const billingAddress = await BillingAddress.findOneAndUpdate(
			filter,
			{
				title,
				salutation,
				addressLine1,
				addressLine2,
				city,
				country,
				companyName,
				firstName,
				lastName,
				identityNumber,
				gsmNumber,
				taxOffice,
				vatNumber,
				zipCode,
				userId,
			},
			{ upsert: true, new: true, strict: false },
		);
		if (!billingAddress) {
			return NextResponse.json(
				{ error: "Failed to create or update billing address" },
				{ status: 400 },
			);
		}

		// Update the User model's billingAddress field
		await User.findOneAndUpdate(
			{ _id: userId },
			{ billingAddress: billingAddress._id },
			{ new: true },
		);

		return NextResponse.json(billingAddress);
	} catch (error: unknown) {
		console.error("Error updating deposit:", error);

		return NextResponse.json(
			{ error: "Failed to update deposit" },
			{ status: 500 },
		);
	}
}
