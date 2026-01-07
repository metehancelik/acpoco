import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { DiscountModel } from "@/models/Discount";
import { DiscountRequestModel } from "@/models/DiscountRequest";

export async function GET(
	_req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		const request = await DiscountRequestModel.findById(params.id)
			.populate("userId", "name surname email")
			.populate("items.productId", "title images")
			.populate("items.variantId", "childSku attributes price");

		if (!request) {
			return NextResponse.json({ error: "Request not found" }, { status: 404 });
		}

		// Check permissions
		if (
			session.user?.role !== "ADMIN" &&
			request.userId.toString() !== session.user?.id
		) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		return NextResponse.json(request);
	} catch (error) {
		console.error("Error fetching discount request:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { id: string } },
) {
	try {
		const session = await getServerSession(authOptions);
		if (!session || session.user?.role !== "ADMIN") {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		await dbConnect();

		const body = await req.json();
		const { status, adminNotes, percentage, scopeType, categoryId, variantId } =
			body;

		const discountRequest = await DiscountRequestModel.findById(params.id);
		if (!discountRequest) {
			return NextResponse.json(
				{ error: "Discount request not found" },
				{ status: 404 },
			);
		}

		if (discountRequest.status !== "pending") {
			return NextResponse.json(
				{ error: "Request already processed" },
				{ status: 400 },
			);
		}

		if (status === "approved") {
			if (!percentage || Number.isNaN(percentage)) {
				return NextResponse.json(
					{ error: "Valid percentage is required for approval" },
					{ status: 400 },
				);
			}

			// Start transaction for atomic discount creation and request update
			const sessionMongoose = await mongoose.startSession();
			sessionMongoose.startTransaction();

			try {
				// 1. Create the Discount record
				const scope: {
					type: string;
					userId?: mongoose.Types.ObjectId;
					categoryId?: string;
					variantId?: string;
				} = { type: scopeType || "user" };
				if (scope.type === "user") scope.userId = discountRequest.userId;
				if (scope.type === "category") scope.categoryId = categoryId;
				if (scope.type === "variant") scope.variantId = variantId;

				const discount = await DiscountModel.create(
					[
						{
							percentage,
							scope,
							discountRequestId: discountRequest._id,
							createdBy: session.user.id,
							isActive: true,
						},
					],
					{ session: sessionMongoose },
				);

				// 2. Update the DiscountRequest
				discountRequest.status = "approved";
				discountRequest.adminNotes = adminNotes;
				discountRequest.approvedBy = session.user.id;
				discountRequest.approvedAt = new Date();
				discountRequest.discountId = discount[0]._id;
				await discountRequest.save({ session: sessionMongoose });

				await sessionMongoose.commitTransaction();
				sessionMongoose.endSession();

				return NextResponse.json({
					message: "Request approved and discount created",
					discountRequest,
				});
			} catch (err) {
				await sessionMongoose.abortTransaction();
				sessionMongoose.endSession();
				throw err;
			}
		} else if (status === "rejected") {
			discountRequest.status = "rejected";
			discountRequest.adminNotes = adminNotes;
			await discountRequest.save();
			return NextResponse.json({
				message: "Request rejected",
				discountRequest,
			});
		} else {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}
	} catch (error) {
		console.error("Error updating discount request:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
