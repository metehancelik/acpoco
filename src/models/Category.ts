import mongoose, { model, models } from "mongoose";

const CategorySchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		image: { type: String, required: false },
	},
	{
		timestamps: true,
		collection: "categories",
	},
);

export const CategoryModel =
	models.Category || model("Category", CategorySchema);
