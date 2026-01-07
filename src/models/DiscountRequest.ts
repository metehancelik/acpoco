import mongoose, { type Document, model, models } from "mongoose";

export interface IDiscountRequestItem {
	variantId?: mongoose.Types.ObjectId;
	productId: mongoose.Types.ObjectId;
	quantity: number;
}

export interface IDiscountRequest extends Document {
	_id: string;
	userId: mongoose.Types.ObjectId;
	items: IDiscountRequestItem[];
	status: "pending" | "approved" | "rejected";
	message?: string;
	adminNotes?: string;
	approvedBy?: mongoose.Types.ObjectId;
	approvedAt?: Date;
	discountId?: mongoose.Types.ObjectId;
	createdAt: Date;
	updatedAt: Date;
}

export interface IDiscountRequestPopulated
	extends Omit<IDiscountRequest, "userId" | "items"> {
	userId: {
		_id: string;
		name: string;
		surname: string;
		email: string;
	};
	items: {
		productId: {
			_id: string;
			title: string;
			category?: {
				_id: string;
				name: string;
			};
		};
		variantId?: {
			_id: string;
			childSku: string;
		};
		quantity: number;
	}[];
}

const DiscountRequestItemSchema = new mongoose.Schema(
	{
		variantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "ProductVariant",
			required: false,
		},
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		quantity: { type: Number, required: true },
	},
	{ _id: false },
);

const DiscountRequestSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		items: {
			type: [DiscountRequestItemSchema],
			required: true,
			validate: {
				validator: (v: IDiscountRequestItem[]) => v.length > 0,
				message: "At least one item is required",
			},
		},
		status: {
			type: String,
			enum: ["pending", "approved", "rejected"],
			default: "pending",
		},
		message: { type: String },
		adminNotes: { type: String },
		approvedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
		approvedAt: { type: Date },
		discountId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Discount",
		},
	},
	{
		timestamps: true,
		collection: "discount_requests",
	},
);

DiscountRequestSchema.index({ userId: 1 });
DiscountRequestSchema.index({ status: 1 });
DiscountRequestSchema.index({ createdAt: -1 });

export const DiscountRequestModel =
	models.DiscountRequest || model("DiscountRequest", DiscountRequestSchema);
