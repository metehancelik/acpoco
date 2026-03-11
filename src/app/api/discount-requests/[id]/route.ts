import type mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
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
		logError(error);
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
		const { status, adminNotes, percentage, scopeType, categoryId } = body;

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

			// Create Discount records
			const createdDiscountIds: mongoose.Types.ObjectId[] = [];

			if (scopeType === "product") {
				// For product scope, create a discount for each item in the request
				for (const item of discountRequest.items) {
					const discount = await DiscountModel.create({
						percentage,
						scope: {
							type: "product",
							userId: discountRequest.userId, // Optional: verify if userId should be included in product scope
							productId: item.productId,
						},
						discountRequestId: discountRequest._id,
						createdBy: session.user.id,
						isActive: true,
					});
					createdDiscountIds.push(discount._id);
				}
			} else {
				// For user or category scope, create a single discount
				const scope: {
					type: string;
					userId?: mongoose.Types.ObjectId;
					categoryId?: string;
					productId?: string;
				} = { type: scopeType || "user" };

				if (scope.type === "user") scope.userId = discountRequest.userId;
				if (scope.type === "category") scope.categoryId = categoryId;
				// product case handled above

				const discount = await DiscountModel.create({
					percentage,
					scope,
					discountRequestId: discountRequest._id,
					createdBy: session.user.id,
					isActive: true,
				});
				createdDiscountIds.push(discount._id);
			}

			// Update the DiscountRequest
			discountRequest.status = "approved";
			discountRequest.adminNotes = adminNotes;
			discountRequest.approvedBy = session.user.id;
			discountRequest.approvedAt = new Date();
			discountRequest.discountIds = createdDiscountIds;

			await discountRequest.save();

			return NextResponse.json({
				message: "Request approved and discount(s) created",
				discountRequest,
			});
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
		logError(error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
