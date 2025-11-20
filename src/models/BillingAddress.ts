import mongoose, { type Model, Schema } from "mongoose";

export type TBillingAddress = {
	title: string;
	salutation?: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	country: string;
	companyName: string;
	firstName: string;
	lastName: string;
	gsmNumber: string;
	vatNumber: string;
	zipCode: string;
	userId: mongoose.Schema.Types.ObjectId;
};
const BillingAddressSchema: Schema = new Schema(
	{
		title: { type: String },
		salutation: { type: String },
		addressLine1: { type: String },
		addressLine2: { type: String },
		city: { type: String },
		country: { type: String },
		companyName: { type: String },
		firstName: { type: String },
		lastName: { type: String },
		gsmNumber: { type: String },
		vatNumber: {
			type: String,
			validate: {
				validator: (v: string | undefined) =>
					!v || /^DE[0-9]{9}$/.test(v.toUpperCase()),
				message: "Invalid USt-IdNr. format (expected: DE followed by 9 digits)",
			},
		},
		zipCode: {
			type: String,
			validate: {
				validator: (v: string | undefined) => !v || /^[0-9]{5}$/.test(v),
				message: "Invalid German PLZ (5 digits required)",
			},
		},
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true },
);

const BillingAddress: Model<TBillingAddress> =
	mongoose.models.BillingAddress ||
	mongoose.model<TBillingAddress>("BillingAddress", BillingAddressSchema);

export default BillingAddress;
