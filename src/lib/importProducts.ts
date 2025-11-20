import fs from "node:fs";

import { parse } from "csv-parse/sync";

import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

import dbConnect from "./db";

interface CSVProduct {
	"Parent SKU": string;
	"Child SKU": string;
	Title: string;
	Price: string;
	Description: string;
	"Weight Value": string;
	"Weight Unit": string;
	Length: string;
	Width: string;
	Height: string;
	Unit: string;
	"Images [ ]": string;
	"Attribute 1 Name": string;
	"Attribute 1 Value": string;
	"Attribute 2 Name": string;
	"Attribute 2 Value": string;
	"Attribute 3 Name": string;
	"Attribute 3 Value": string;
	"Attribute 4 Name": string;
	"Attribute 4 Value": string;
	"Attribute 5 Name": string;
	"Attribute 5 Value": string;
	"Attribute 6 Name": string;
	"Attribute 6 Value": string;
	"Attribute 7 Name": string;
	"Attribute 7 Value": string;
}

interface JSONProduct {
	"Parent SKU": string;
	"Child SKU": string;
	Title: string;
	Price: string;
	Description: string;
	"Weight Value": string;
	"Weight Unit": string;
	Length: string;
	Width: string;
	Height: string;
	Unit: string;
	"Images [ ]": string;
	"Attribute 1 Name": string;
	"Attribute 1 Value": string;
	"Attribute 2 Name": string;
	"Attribute 2 Value": string;
	"Attribute 3 Name": string;
	"Attribute 3 Value": string;
	"Attribute 4 Name": string;
	"Attribute 4 Value": string;
	"Attribute 5 Name": string;
	"Attribute 5 Value": string;
	"Attribute 6 Name": string;
	"Attribute 6 Value": string;
	"Attribute 7 Name": string;
	"Attribute 7 Value": string;
}

export async function importProductsFromCSV(filePath: string) {
	try {
		await dbConnect();

		// Read and parse CSV file
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const records = parse(fileContent, {
			columns: true,
			skip_empty_lines: true,
		}) as CSVProduct[];

		// Group records by Parent SKU
		const parentProducts = new Map<string, CSVProduct>();
		const childProducts = new Map<string, CSVProduct[]>();

		records.forEach((record) => {
			// If record has no Child SKU, it's a parent product
			if (!record["Child SKU"]) {
				parentProducts.set(record["Parent SKU"], record);
			} else {
				// If it has Child SKU, it's a variant
				const children = childProducts.get(record["Parent SKU"]) || [];
				// Convert Child SKU to string to ensure consistent comparison
				record["Child SKU"] = record["Child SKU"].toString();
				children.push(record);
				childProducts.set(record["Parent SKU"], children);
			}
		});

		// Process each parent product and its variants
		const parentProductsArray = Array.from(parentProducts.entries());
		for (const [parentSku, parentRecord] of parentProductsArray) {
			// Skip if required fields are missing
			if (!parentRecord.Title || !parentRecord.Description || !parentSku) {
				console.warn(
					`Skipping product with SKU ${parentSku} due to missing required fields`,
				);
				continue;
			}

			// Helper function to clean attribute values
			const cleanAttributeValue = (value: string | undefined) => {
				if (!value) return [];
				// Remove brackets and split by semicolon

				return value
					.replace(/[[\]]/g, "")
					.split(";")
					.map((v) => v.trim());
			};

			// Helper function to convert price
			const convertPrice = (price: string | number | undefined) => {
				if (price === undefined) return 0;
				if (typeof price === "number") return price;

				return parseFloat(price.replace(",", ".")) || 0;
			};

			// Create parent product
			const parentProduct = await Product.create({
				parentSku: parentSku,
				title: parentRecord.Title,
				price: convertPrice(parentRecord.Price),
				description: parentRecord.Description,
				weight: {
					value: parseFloat(parentRecord["Weight Value"] || "0"),
					unit: parentRecord["Weight Unit"] || "oz",
				},
				dimensions: {
					length: parseFloat(parentRecord.Length || "0"),
					width: parseFloat(parentRecord.Width || "0"),
					height: parseFloat(parentRecord.Height || "0"),
					unit: parentRecord.Unit || "in",
				},
				images: parentRecord["Images [ ]"] ? [parentRecord["Images [ ]"]] : [],
				attributes: [
					{
						name: parentRecord["Attribute 1 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 1 Value"]),
					},
					{
						name: parentRecord["Attribute 2 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 2 Value"]),
					},
					{
						name: parentRecord["Attribute 3 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 3 Value"]),
					},
					{
						name: parentRecord["Attribute 4 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 4 Value"]),
					},
					{
						name: parentRecord["Attribute 5 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 5 Value"]),
					},
					{
						name: parentRecord["Attribute 6 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 6 Value"]),
					},
					{
						name: parentRecord["Attribute 7 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 7 Value"]),
					},
				].filter((attr) => attr.name && attr.values.length > 0),
				category: "6796141a11ef7d9360a785eb", // Default category ID
			});

			// Create variants
			const children = childProducts.get(parentSku) || [];
			for (const childRecord of children) {
				// Filter out empty attributes and ensure values match parent's possible values
				const variantAttributes = [
					{
						name: childRecord["Attribute 1 Name"],
						value: childRecord["Attribute 1 Value"],
					},
					{
						name: childRecord["Attribute 2 Name"],
						value: childRecord["Attribute 2 Value"],
					},
					{
						name: childRecord["Attribute 3 Name"],
						value: childRecord["Attribute 3 Value"],
					},
					{
						name: childRecord["Attribute 4 Name"],
						value: childRecord["Attribute 4 Value"],
					},
					{
						name: childRecord["Attribute 5 Name"],
						value: childRecord["Attribute 5 Value"],
					},
					{
						name: childRecord["Attribute 6 Name"],
						value: childRecord["Attribute 6 Value"],
					},
					{
						name: childRecord["Attribute 7 Name"],
						value: childRecord["Attribute 7 Value"],
					},
				].filter((attr) => attr.name && attr.value);

				await ProductVariantModel.create({
					productId: parentProduct._id,
					childSku: childRecord["Child SKU"].toString(),
					price: convertPrice(childRecord.Price),
					attributes: variantAttributes,
				});
			}
		}

		return { success: true, message: "Products imported successfully" };
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		console.error("Error importing products:", errorMessage);

		return { success: false, error: errorMessage };
	}
}

export async function importProductsFromJSON(filePath: string) {
	try {
		await dbConnect();

		// Read and parse JSON file
		const fileContent = fs.readFileSync(filePath, "utf-8");
		const records = JSON.parse(fileContent) as JSONProduct[];

		// Group records by Parent SKU
		const parentProducts = new Map<string, JSONProduct>();
		const childProducts = new Map<string, JSONProduct[]>();

		records.forEach((record) => {
			// If record has no Child SKU, it's a parent product
			if (!record["Child SKU"]) {
				parentProducts.set(record["Parent SKU"], record);
			} else {
				// If it has Child SKU, it's a variant
				const children = childProducts.get(record["Parent SKU"]) || [];
				// Convert Child SKU to string to ensure consistent comparison
				record["Child SKU"] = record["Child SKU"].toString();
				children.push(record);
				childProducts.set(record["Parent SKU"], children);
			}
		});

		// Process each parent product and its variants
		const parentProductsArray = Array.from(parentProducts.entries());
		for (const [parentSku, parentRecord] of parentProductsArray) {
			// Skip if required fields are missing
			if (!parentRecord.Title || !parentRecord.Description || !parentSku) {
				console.warn(
					`Skipping product with SKU ${parentSku} due to missing required fields`,
				);
				continue;
			}

			// Helper function to clean attribute values
			const cleanAttributeValue = (value: string | undefined) => {
				if (!value) return [];
				// Remove brackets and split by semicolon

				return value
					.replace(/[[\]]/g, "")
					.split(";")
					.map((v) => v.trim());
			};

			// Helper function to convert price
			const convertPrice = (price: string | number | undefined) => {
				if (price === undefined) return 0;
				if (typeof price === "number") return price;

				return parseFloat(price.replace(",", ".")) || 0;
			};

			// Create parent product
			const parentProduct = await Product.create({
				parentSku: parentSku,
				title: parentRecord.Title,
				price: convertPrice(parentRecord.Price),
				description: parentRecord.Description,
				weight: {
					value: parseFloat(parentRecord["Weight Value"] || "0"),
					unit: parentRecord["Weight Unit"] || "oz",
				},
				dimensions: {
					length: parseFloat(parentRecord.Length || "0"),
					width: parseFloat(parentRecord.Width || "0"),
					height: parseFloat(parentRecord.Height || "0"),
					unit: parentRecord.Unit || "in",
				},
				images: parentRecord["Images [ ]"] ? [parentRecord["Images [ ]"]] : [],
				attributes: [
					{
						name: parentRecord["Attribute 1 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 1 Value"]),
					},
					{
						name: parentRecord["Attribute 2 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 2 Value"]),
					},
					{
						name: parentRecord["Attribute 3 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 3 Value"]),
					},
					{
						name: parentRecord["Attribute 4 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 4 Value"]),
					},
					{
						name: parentRecord["Attribute 5 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 5 Value"]),
					},
					{
						name: parentRecord["Attribute 6 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 6 Value"]),
					},
					{
						name: parentRecord["Attribute 7 Name"],
						values: cleanAttributeValue(parentRecord["Attribute 7 Value"]),
					},
				].filter((attr) => attr.name && attr.values.length > 0),
				category: "6796141a11ef7d9360a785eb", // Default category ID
			});

			// Create variants
			const children = childProducts.get(parentSku) || [];
			for (const childRecord of children) {
				// Filter out empty attributes and ensure values match parent's possible values
				const variantAttributes = [
					{
						name: childRecord["Attribute 1 Name"],
						value: childRecord["Attribute 1 Value"],
					},
					{
						name: childRecord["Attribute 2 Name"],
						value: childRecord["Attribute 2 Value"],
					},
					{
						name: childRecord["Attribute 3 Name"],
						value: childRecord["Attribute 3 Value"],
					},
					{
						name: childRecord["Attribute 4 Name"],
						value: childRecord["Attribute 4 Value"],
					},
					{
						name: childRecord["Attribute 5 Name"],
						value: childRecord["Attribute 5 Value"],
					},
					{
						name: childRecord["Attribute 6 Name"],
						value: childRecord["Attribute 6 Value"],
					},
					{
						name: childRecord["Attribute 7 Name"],
						value: childRecord["Attribute 7 Value"],
					},
				].filter((attr) => attr.name && attr.value);

				await ProductVariantModel.create({
					productId: parentProduct._id,
					childSku: childRecord["Child SKU"].toString(),
					price: convertPrice(childRecord.Price),
					attributes: variantAttributes,
				});
			}
		}

		return { success: true, message: "Products imported successfully" };
	} catch (error: unknown) {
		const errorMessage =
			error instanceof Error ? error.message : "An unknown error occurred";
		console.error("Error importing products:", errorMessage);

		return { success: false, error: errorMessage };
	}
}
