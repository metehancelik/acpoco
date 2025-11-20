import { type NextRequest, NextResponse } from "next/server";

import dbConnect from "@/lib/db";
import Product from "@/models/Product";

const ITEMS_PER_PAGE = 24;

/**
 * @swagger
 * /api/catalog:
 *   get:
 *     summary: Ürün kataloğunu getirir
 *     description: Database'deki tüm ürünleri pagination ile getirir
 *     tags:
 *       - Catalog
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Sayfa numarası
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Kategori ID'sine göre filtreleme (opsiyonel)
 *     responses:
 *       200:
 *         description: Ürünler başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     products:
 *                       type: array
 *                       items:
 *                         type: object
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                         totalItems:
 *                           type: integer
 *                         itemsPerPage:
 *                           type: integer
 *                         hasNextPage:
 *                           type: boolean
 *                         hasPreviousPage:
 *                           type: boolean
 *       500:
 *         description: Sunucu hatası
 */
export async function GET(request: NextRequest) {
	try {
		await dbConnect();

		const { searchParams } = new URL(request.url);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const categoryId = searchParams.get("category");

		// Sayfa numarası geçerli olmalı
		if (page < 1) {
			return NextResponse.json(
				{
					success: false,
					error: "Geçersiz sayfa numarası",
				},
				{ status: 400 },
			);
		}

		// Filter objesi oluştur
		const filter: { category?: string } = {};
		if (categoryId) {
			filter.category = categoryId;
		}

		// Toplam ürün sayısını al
		const totalItems = await Product.countDocuments(filter);

		// Toplam sayfa sayısını hesapla
		const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

		// Skip değerini hesapla
		const skip = (page - 1) * ITEMS_PER_PAGE;

		// Ürünleri çek
		const products = await Product.find(filter)
			.populate("category")
			.sort({ createdAt: -1 }) // En yeni ürünler önce
			.skip(skip)
			.limit(ITEMS_PER_PAGE)
			.lean();

		return NextResponse.json({
			success: true,
			data: {
				products,
				pagination: {
					currentPage: page,
					totalPages,
					totalItems,
					itemsPerPage: ITEMS_PER_PAGE,
					hasNextPage: page < totalPages,
					hasPreviousPage: page > 1,
				},
			},
		});
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error("Ürünler getirilirken hata oluştu:", error);

		return NextResponse.json(
			{
				success: false,
				error: "Ürünler getirilirken bir hata oluştu",
				details: error instanceof Error ? error.message : "Bilinmeyen hata",
			},
			{ status: 500 },
		);
	}
}
