import mongoose, { Document, model, models } from "mongoose";

export interface ICategory extends Document {
  _id: string;
  name: string;
  image: string;
}

export interface IProduct extends Document {
  _id: string;
  parentSku: string;
  title: string;
  price: number;
  description: string;
  weight: {
    value: number;
    unit: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images: string[];
  attributes: { name: string; values: string[] }[];
  category: ICategory;
  estimatedProductionTime?: string;
}

const ProductSchema = new mongoose.Schema(
  {
    parentSku: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    weight: {
      value: Number,
      unit: String,
    },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
      unit: String,
    },
    images: { type: [String], required: true },
    attributes: [
      {
        name: String,
        values: [String],
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    estimatedProductionTime: { type: String },
  },
  {
    timestamps: true,
    collection: "products",
  },
);

const Product = models.Product || model("Product", ProductSchema);

export default Product;
