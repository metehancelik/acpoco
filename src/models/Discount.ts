import mongoose, { type Document, model, models } from "mongoose";

export interface IDiscountScope {
	type: "user" | "category" | "variant";
	userId?: mongoose.Types.ObjectId;
	categoryId?: mongoose.Types.ObjectId;
	variantId?: mongoose.Types.ObjectId;
}

export interface IDiscount extends Document {
	_id: string;
	percentage: number;
	scope: IDiscountScope;
	discountRequestId?: mongoose.Types.ObjectId;
	createdBy: mongoose.Types.ObjectId;
	isActive: boolean;
	expiresAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}

const DiscountScopeSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			enum: ["user", "category", "variant"],
			required: true,
		},
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		categoryId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Category",
		},
		variantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductVariant",
		},
	},
	{ _id: false },
);

const DiscountSchema = new mongoose.Schema(
	{
		percentage: {
			type: Number,
			required: true,
			min: 0,
			max: 100,
		},
		scope: {
			type: DiscountScopeSchema,
			required: true,
		},
		discountRequestId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "DiscountRequest",
		},
		createdBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
		expiresAt: { type: Date },
	},
	{
		timestamps: true,
		collection: "discounts",
	},
);

// Indexes for efficient lookup
DiscountSchema.index({ isActive: 1 });
DiscountSchema.index({ "scope.type": 1 });
DiscountSchema.index({ "scope.userId": 1 });
DiscountSchema.index({ "scope.categoryId": 1 });
DiscountSchema.index({ "scope.variantId": 1 });
DiscountSchema.index({ expiresAt: 1 });

export const DiscountModel =
	models.Discount || model("Discount", DiscountSchema);
