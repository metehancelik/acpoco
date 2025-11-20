import mongoose from "mongoose";

const WalletLogSchema = new mongoose.Schema(
	{
		info: { type: String },
		changeAmount: { type: Number, default: 0 },
		currentBalance: { type: Number, default: 0 },
		finalBalance: { type: Number, default: 0 },
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		type: {
			type: String,
			enum: ["DEPOSIT", "WITHDRAW"],
		},
		changedBy: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
	},
	{ timestamps: true },
);

const WalletLog =
	mongoose.models.WalletLog || mongoose.model("WalletLog", WalletLogSchema);

export default WalletLog;
