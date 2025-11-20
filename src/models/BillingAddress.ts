import mongoose, { type Model, Schema } from "mongoose";

interface IBillingAddress {
	title: string;
	addressLine1: string;
	addressLine2: string;
	city: string;
	country: string;
	companyName: string;
	firstName: string;
	lastName: string;
	identityNumber: string;
	gsmNumber: string;
	taxOffice: string;
	vatNumber: string;
	zipCode: string;
	userId: mongoose.Schema.Types.ObjectId;
}
const BillingAddressSchema: Schema = new Schema(
	{
		title: { type: String },
		addressLine1: { type: String },
		addressLine2: { type: String },
		city: { type: String },
		country: { type: String },
		companyName: { type: String },
		firstName: { type: String },
		lastName: { type: String },
		identityNumber: { type: String },
		gsmNumber: { type: String },
		taxOffice: { type: String },
		vatNumber: { type: String },
		zipCode: { type: String },
		userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true },
);

const BillingAddress: Model<IBillingAddress> =
	mongoose.models.BillingAddress ||
	mongoose.model<IBillingAddress>("BillingAddress", BillingAddressSchema);

export default BillingAddress;
