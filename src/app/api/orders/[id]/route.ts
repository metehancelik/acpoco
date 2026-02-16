import type mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { DiscountModel } from "@/models/Discount";
import Order from "@/models/Order";
import { ProductVariantModel } from "@/models/ProductVariant";
import User from "@/models/User";
import { calculateDiscountedPrice } from "@/utils/discountCalculator";

export async function GET(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const order = await Order.findById(params.id);

		return NextResponse.json(order);
	} catch (error) {
		console.error("Error fetching order:", error);

		return NextResponse.json(
			{ error: "Failed to fetch order" },
			{ status: 500 },
		);
	}
}

export async function POST(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const userId = session.user?.id;
	const user = await User.findById(userId);
	try {
		const body = await request.json();

		const order = await Order.findById(params.id);

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		// Convert the attributes object to array of conditions for matching
		const attributeConditions = Object.entries(body.selectedAttributes)
			.filter(([name]) => name !== "productId")
			.map(([name, value]) => ({
				attributes: {
					$elemMatch: {
						name,
						value,
					},
				},
			}));

		const productVariant = await ProductVariantModel.findOne({
			productId: body.selectedAttributes.productId,
			$and: attributeConditions,
		}).populate({
			path: "productId",
			select: "category",
		});

		if (!productVariant) {
			return NextResponse.json(
				{ error: "Product variant not found" },
				{ status: 404 },
			);
		}

		const populatedProduct = productVariant.productId as unknown as {
			_id: mongoose.Types.ObjectId;
			category: mongoose.Types.ObjectId;
		};
		const productIdForDiscount =
			populatedProduct?._id ??
			(productVariant.productId as mongoose.Types.ObjectId);
		const categoryIdForDiscount = populatedProduct?.category?.toString() ?? "";

		// Fetch active discounts for this user and item (scope.productId is Product _id, not variant)
		const activeDiscounts = await DiscountModel.find({
			isActive: true,
			$or: [
				{ "scope.userId": user._id },
				{ "scope.categoryId": populatedProduct?.category },
				{ "scope.productId": productIdForDiscount },
				{ "scope.type": "category" },
			],
		});

		for (const item of order.items) {
			if (item.orderItemId === body.orderItemId) {
				item.matchId = productVariant._id;
				const basePrice = productVariant.price;

				const { finalPrice } = calculateDiscountedPrice(
					basePrice,
					user._id.toString(),
					categoryIdForDiscount,
					productIdForDiscount.toString(),
					activeDiscounts,
				);

				item.matchedPrice = finalPrice;
			}
		}
		if (order.items.every((item: { matchId: string }) => item.matchId)) {
			order.status = "waitingPayment";
		}
		await order.save();

		return NextResponse.json({ message: "Urun eslestirildi" });
	} catch (error) {
		console.error("Error updating order:", error);

		return NextResponse.json(
			{ error: "Failed to update order" },
			{ status: 500 },
		);
	}
}

export async function PUT(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();
		const updates = { ...body };

		const order = await Order.findOneAndUpdate(
			{ _id: params.id },
			{ $set: updates },
			{ new: true },
		);

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json(order);
	} catch (error) {
		console.error("Error updating order:", error);

		return NextResponse.json(
			{ error: "Failed to update order" },
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session || session.user?.role !== "ADMIN") {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		await Order.findByIdAndDelete(params.id);

		return NextResponse.json({ message: "Order deleted successfully" });
	} catch (error) {
		console.error("Error deleting order:", error);

		return NextResponse.json(
			{ error: "Failed to delete order" },
			{ status: 500 },
		);
	}
}

export async function PATCH(
	request: Request,
	{ params }: { params: { id: string } },
) {
	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	try {
		const body = await request.json();

		const updates = Object.entries(body).reduce(
			(acc: Record<string, unknown>, [key, value]) => {
				if (typeof value === "object" && value !== null) {
					Object.entries(value).forEach(([nestedKey, nestedValue]) => {
						acc[`${key}.${nestedKey}`] = nestedValue;
					});
				} else {
					acc[key] = value;
				}

				return acc;
			},
			{},
		);

		const order = await Order.findOneAndUpdate(
			{ _id: params.id },
			{ $set: updates },
			{ new: true },
		);

		if (!order) {
			return NextResponse.json({ error: "Order not found" }, { status: 404 });
		}

		return NextResponse.json(order);
	} catch (error) {
		console.error("Error updating order:", error);

		return NextResponse.json(
			{ error: "Failed to update order" },
			{ status: 500 },
		);
	}
}
