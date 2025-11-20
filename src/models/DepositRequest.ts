import mongoose from "mongoose";

const DepositRequestSchema = new mongoose.Schema(
	{
		requestInfo: { type: String },
		reviewInfo: { type: String },
		requestedAmount: { type: Number, default: 0 },
		requestedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		status: {
			type: String,
			enum: ["PENDING", "APPROVED", "REJECTED"],
			default: "PENDING",
		},
	},
	{ timestamps: true },
);

const DepositRequest =
	mongoose.models.DepositRequest ||
	mongoose.model("DepositRequest", DepositRequestSchema);

export default DepositRequest;
