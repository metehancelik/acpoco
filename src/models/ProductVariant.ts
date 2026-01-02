import mongoose, { model, models } from "mongoose";

import Product from "@/models/Product";

export type IProductVariant = {
	_id: string;
	productId: string;
	childSku: string;
	price: number;
	attributes: { name: string; value: string }[];
	image?: string;
	stock: number;
};

const ProductVariantSchema = new mongoose.Schema(
	{
		productId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: Product,
			required: true,
		},
		childSku: { type: String, required: true, unique: true },
		price: { type: Number, required: true },
		attributes: [
			{
				name: String,
				value: String,
			},
		],
		image: { type: String },
		stock: { type: Number, default: 0 },
	},
	{
		timestamps: true,
		collection: "product_variants",
	},
);

export const ProductVariantModel =
	models.ProductVariant || model("ProductVariant", ProductVariantSchema);

// arama cubugu 1 input => sku / title (Product Variant)
