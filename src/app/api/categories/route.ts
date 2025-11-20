import { NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import { CategoryModel } from "@/models/Category";

const categories = [
	{
		name: "Kolye",
		image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
	},
	{
		name: "Bileklik",
		image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
	},
	{
		name: "Küpe",
		image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
	},
	{
		name: "Halhal",
		image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
	},
	{
		name: "Yüzük",
		image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
	},
];

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Tüm kategorileri getirir
 *     description: Database'deki tüm kategorileri getirir
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Kategoriler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   image:
 *                     type: string
 *       500:
 *         description: Sunucu hatası
 */
export async function GET() {
	try {
		await dbConnect();
		const categories = await CategoryModel.find({}).sort({ name: 1 });

		return NextResponse.json(categories);
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Error fetching categories:", error);

		return NextResponse.json(
			{ error: "Failed to fetch categories" },
			{ status: 500 },
		);
	}
}

export async function POST() {
	try {
		await CategoryModel.insertMany(categories);

		return NextResponse.json({ message: "Categories created successfully" });
	} catch (error) {
		console.error("Error creating categories", error);

		return NextResponse.json(
			{ error: "Error creating categories" },
			{ status: 500 },
		);
	}
}
