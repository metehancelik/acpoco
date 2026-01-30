import mongoose from "mongoose";

import { ProductVariantModel } from "@/models/ProductVariant";

const AddressSchema = new mongoose.Schema(
	{
		name: String,
		company: String,
		street1: String,
		street2: String,
		street3: String,
		city: String,
		state: String,
		postalCode: String,
		country: String,
		phone: String,
		residential: Boolean,
		addressVerified: String,
	},
	{ _id: false },
);

const OrderItemSchema = new mongoose.Schema(
	{
		orderItemId: { type: Number, required: true },
		lineItemKey: String,
		sku: String,
		name: String,
		imageUrl: String,
		designUrl: String,
		weight: Number,
		quantity: { type: Number, required: true },
		unitPrice: { type: Number, required: true },
		taxAmount: Number,
		shippingAmount: Number,
		warehouseLocation: String,
		options: [{ name: String, value: String }],
		amazonCustomizationData: mongoose.Schema.Types.Mixed,
		amazonCustomizationOptions: [
			{
				label: String,
				option: String,
				priceDelta: Number,
				unit: String,
			},
		],
		productId: Number,
		fulfillmentSku: String,
		adjustment: Boolean,
		upc: String,
		createDate: Date,
		modifyDate: Date,
		matchId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: ProductVariantModel,
		},
		matchedPrice: Number,
	},
	{ _id: false },
);

const OrderSchema = new mongoose.Schema({
	orderId: { type: Number, required: true, unique: true },
	orderNumber: String,
	orderKey: String,
	orderDate: Date,
	createDate: Date,
	modifyDate: Date,
	paymentDate: Date,
	shipByDate: Date,
	status: {
		type: String,
		enum: [
			"waitingMatch",
			"waitingPayment",
			"waitingProduction",
			"processing",
			"shipped",
		],
		required: true,
	},
	orderStatus: String,
	warehouse: {
		type: String,
		enum: ["GB", "US", "DE", "shipEntegra", "seller"],
	},
	warehousePrice: Number,
	warehouseTrackingNumber: String,
	warehouseShippingService: String,
	customerId: { type: Number, required: true },
	customerUsername: String,
	customerEmail: { type: String, required: false, default: "" },
	billTo: AddressSchema,
	shipTo: AddressSchema,
	items: [OrderItemSchema],
	orderTotal: { type: Number, required: true },
	amountPaid: { type: Number, required: true },
	taxAmount: Number,
	shippingAmount: Number,
	discountTotal: Number,
	customerNotes: String,
	internalNotes: String,
	gift: Boolean,
	giftMessage: String,
	sellerNote: String,
	isPayed: Boolean,
	paymentMethod: String,
	requestedShippingService: String,
	carrierCode: String,
	serviceCode: String,
	packageCode: String,
	confirmation: String,
	shipDate: Date,
	holdUntilDate: Date,
	weight: {
		value: Number,
		units: String,
	},
	dimensions: mongoose.Schema.Types.Mixed,
	insuranceOptions: {
		provider: String,
		insureShipment: Boolean,
		insuredValue: Number,
	},
	internationalOptions: {
		contents: mongoose.Schema.Types.Mixed,
		customsItems: mongoose.Schema.Types.Mixed,
		nonDelivery: mongoose.Schema.Types.Mixed,
	},
	advancedOptions: {
		warehouseId: Number,
		nonMachinable: Boolean,
		saturdayDelivery: Boolean,
		containsAlcohol: Boolean,
		mergedOrSplit: Boolean,
		mergedIds: [Number],
		parentId: Number,
		storeId: { type: Number, ref: "Store" },
		customField1: String,
		customField2: String,
		customField3: String,
		source: String,
		billToParty: Number,
		billToAccount: Number,
		billToPostalCode: Number,
		billToCountryCode: Number,
		billToMyOtherAccount: Number,
	},
	tagIds: [Number],
	externallyFulfilled: Boolean,
	externallyFulfilledBy: String,
	externallyFulfilledById: Number,
	externallyFulfilledByName: String,
	labelMessages: String,
	labelUrl: String,
	// Required for ShipStation sync (see docs/SHIPSTATION_ORDER_SYNC.md)
	storeId: { type: Number, ref: "Store" },
	createdAt: { type: Date, default: Date.now },
	updatedAt: { type: Date, default: Date.now },
});

OrderSchema.index({ orderId: 1 });
OrderSchema.index({ customerEmail: 1 });
OrderSchema.index({ createDate: 1 });
OrderSchema.index({ orderStatus: 1 });

OrderSchema.pre("save", function (next) {
	this.updatedAt = new Date();
	next();
});

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
