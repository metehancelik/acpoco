import fs from "node:fs";
import path from "node:path";

import jsPDF from "jspdf";

import type { IDiscount } from "@/models/Discount";
import { calculateDiscountedPrice } from "@/utils/discountCalculator";
import { normalizeImageSrc } from "@/utils/normalizeImageUrl";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface VariantForPDF {
	id: string;
	price: string;
	sku: string | null;
	inventoryQuantity: number;
	selectedOptions: { name: string; value: string }[];
	image?: { url: string };
}

export interface ProductForPDF {
	_id: string;
	title: string;
	price: number;
	images: string[];
	parentSku: string;
	category: { _id: string; name: string } | string;
	shopifyData?: { variants: VariantForPDF[] };
}

export interface CataloguePDFOptions {
	userId: string;
	discounts: IDiscount[];
	exportDate?: Date;
}

// ─── Layout constants ─────────────────────────────────────────────────────────

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 10;
const USABLE_W = PAGE_W - MARGIN * 2;
const HEADER_H = 24; // document title area
const TABLE_HEADER_H = 9;
const ROW_H = 22; // variant row height (fits 20×20 image)
const IMG_SIZE = 18; // image square mm
const IMG_PAD = (ROW_H - IMG_SIZE) / 2;

// Column widths must sum to USABLE_W (190 mm)
const COL = {
	category: 22,
	name: 40,
	variation: 35,
	image: 22,
	sku: 24,
	stock: 18,
	price: 29,
} as const;

// ─── Colors ───────────────────────────────────────────────────────────────────

const C = {
	headerBg: [180, 120, 20] as [number, number, number], // amber-700
	headerText: [255, 255, 255] as [number, number, number],
	productBg: [254, 243, 199] as [number, number, number], // amber-100 band
	evenBg: [250, 250, 249] as [number, number, number], // stone-50
	oddBg: [255, 255, 255] as [number, number, number],
	border: [214, 211, 209] as [number, number, number], // stone-300
	separatorBorder: [161, 152, 147] as [number, number, number], // stone-400
	text: [28, 25, 23] as [number, number, number], // stone-900
	textMuted: [120, 113, 108] as [number, number, number], // stone-500
	discountBg: [254, 215, 170] as [number, number, number], // orange-200
	discountText: [154, 52, 18] as [number, number, number], // orange-800
	discountedPrice: [22, 101, 52] as [number, number, number], // green-800
	noImage: [245, 245, 244] as [number, number, number], // stone-100
} as const;

// ─── Font loader ──────────────────────────────────────────────────────────────

async function loadFont(): Promise<string | null> {
	try {
		const fontPath = path.join(
			process.cwd(),
			"public",
			"fonts",
			"NotoSans_Condensed-Bold.ttf",
		);
		const buf = fs.readFileSync(fontPath);
		return buf.toString("base64");
	} catch {
		return null;
	}
}

// ─── Image fetcher ────────────────────────────────────────────────────────────

async function fetchImageBase64(url: string): Promise<string | null> {
	try {
		const normalised = normalizeImageSrc(url);
		if (!normalised) return null;
		const res = await fetch(normalised, {
			signal: AbortSignal.timeout(6000),
			headers: { "User-Agent": "Mozilla/5.0" },
		});
		if (!res.ok) return null;
		const buf = Buffer.from(await res.arrayBuffer());
		const ct = res.headers.get("content-type") ?? "image/jpeg";
		const mime = ct.includes("png") ? "image/png" : "image/jpeg";
		return `data:${mime};base64,${buf.toString("base64")}`;
	} catch {
		return null;
	}
}

async function prefetchImages(
	products: ProductForPDF[],
): Promise<Map<string, string | null>> {
	const urls = new Set<string>();
	for (const p of products) {
		const variants = p.shopifyData?.variants ?? [];
		if (variants.length === 0) {
			const img = p.images?.[0];
			if (img) urls.add(img);
		} else {
			for (const v of variants) {
				const img = v.image?.url ?? p.images?.[0];
				if (img) urls.add(img);
			}
		}
	}

	const entries = await Promise.all(
		Array.from(urls).map(
			async (url): Promise<[string, string | null]> => [
				url,
				await fetchImageBase64(url),
			],
		),
	);
	return new Map(entries);
}

// ─── PDF drawing helpers ──────────────────────────────────────────────────────

function setupFont(pdf: jsPDF, fontLoaded: boolean) {
	if (fontLoaded) {
		pdf.setFont("NotoSans", "bold");
	} else {
		pdf.setFont("helvetica", "bold");
	}
}

function setColor(
	pdf: jsPDF,
	type: "fill" | "draw" | "text",
	rgb: [number, number, number],
) {
	if (type === "fill") pdf.setFillColor(rgb[0], rgb[1], rgb[2]);
	else if (type === "draw") pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
	else pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
}

function colX(colKey: keyof typeof COL): number {
	const keys = Object.keys(COL) as (keyof typeof COL)[];
	let x = MARGIN;
	for (const k of keys) {
		if (k === colKey) return x;
		x += COL[k];
	}
	return x;
}

/** Draws the document-level header (title + export date) */
function drawDocumentHeader(
	pdf: jsPDF,
	y: number,
	exportDate: Date,
	fontLoaded: boolean,
) {
	setupFont(pdf, fontLoaded);
	setColor(pdf, "text", C.text);
	pdf.setFontSize(16);
	pdf.text("ÜRÜN KATALOĞU", PAGE_W / 2, y + 7, { align: "center" });

	pdf.setFontSize(8);
	setColor(pdf, "text", C.textMuted);
	const dateStr = exportDate.toLocaleDateString("tr-TR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
	pdf.text(`Dışa aktarma tarihi: ${dateStr}`, MARGIN + USABLE_W, y + 12, {
		align: "right",
	});

	// Thin separator line
	setColor(pdf, "draw", C.separatorBorder);
	pdf.setLineWidth(0.4);
	pdf.line(MARGIN, y + HEADER_H - 2, MARGIN + USABLE_W, y + HEADER_H - 2);
}

/** Draws the column header row */
function drawTableHeader(pdf: jsPDF, y: number, fontLoaded: boolean) {
	// Background
	setColor(pdf, "fill", C.headerBg);
	pdf.rect(MARGIN, y, USABLE_W, TABLE_HEADER_H, "F");

	// Column labels
	setupFont(pdf, fontLoaded);
	pdf.setFontSize(7);
	setColor(pdf, "text", C.headerText);

	const labels: Record<keyof typeof COL, string> = {
		category: "KATEGORİ",
		name: "ÜRÜN ADI",
		variation: "VARYASYON",
		image: "GÖRSEL",
		sku: "SKU",
		stock: "STOK",
		price: "FİYAT",
	};

	let cx = MARGIN;
	for (const [key, label] of Object.entries(labels) as [
		keyof typeof COL,
		string,
	][]) {
		const w = COL[key];
		pdf.text(label, cx + w / 2, y + TABLE_HEADER_H / 2 + 2.5, {
			align: "center",
		});
		cx += w;
	}

	// Column dividers
	setColor(pdf, "draw", [255, 255, 255]);
	pdf.setLineWidth(0.2);
	cx = MARGIN;
	for (const key of Object.keys(COL) as (keyof typeof COL)[]) {
		cx += COL[key];
		if (cx < MARGIN + USABLE_W) {
			pdf.line(cx, y, cx, y + TABLE_HEADER_H);
		}
	}
}

/** Returns the color value for a variant, used to group by color for image deduplication. */
function getColorKey(variant: VariantForPDF): string {
	const colorAttr = variant.selectedOptions.find((o) =>
		/renk|color|colour|farbe/i.test(o.name),
	);
	// Fall back to the image URL so variants without a color attr are grouped by image
	return colorAttr?.value ?? variant.image?.url ?? "__single__";
}

/** Draws a single variant row */
function drawVariantRow(
	pdf: jsPDF,
	opts: {
		y: number;
		isEven: boolean;
		category: string;
		productName: string;
		showProductInfo: boolean;
		productGroupHeight: number;
		variantAttrs: string;
		imageData: string | null;
		showImage: boolean;
		sku: string;
		stock: number;
		basePrice: number;
		finalPrice: number;
		discountPercent: number;
		fontLoaded: boolean;
	},
) {
	const {
		y,
		isEven,
		showProductInfo,
		productGroupHeight,
		category,
		productName,
		variantAttrs,
		imageData,
		showImage,
		sku,
		stock,
		basePrice,
		finalPrice,
		discountPercent,
		fontLoaded,
	} = opts;

	const bg = isEven ? C.evenBg : C.oddBg;
	setColor(pdf, "fill", bg);

	// Background for the row (only non-product-info columns)
	const varColX = colX("variation");
	const varColW = COL.variation + COL.image + COL.sku + COL.stock + COL.price;
	pdf.rect(varColX, y, varColW, ROW_H, "F");

	// Product-group cells (category + name) — only draw on first variant
	if (showProductInfo) {
		setColor(pdf, "fill", C.productBg);
		pdf.rect(MARGIN, y, COL.category + COL.name, productGroupHeight, "F");
	}

	// ── Category text ──
	if (showProductInfo) {
		setupFont(pdf, fontLoaded);
		pdf.setFontSize(7);
		setColor(pdf, "text", C.textMuted);
		const cx = MARGIN + COL.category / 2;
		const cy = y + productGroupHeight / 2;
		// Wrap and center vertically
		const lines = pdf.splitTextToSize(category, COL.category - 4);
		const lineH = 3.5;
		const totalH = lines.length * lineH;
		for (let i = 0; i < lines.length; i++) {
			pdf.text(lines[i], cx, cy - totalH / 2 + i * lineH + lineH / 2, {
				align: "center",
			});
		}
	}

	// ── Product name text ──
	if (showProductInfo) {
		setupFont(pdf, fontLoaded);
		pdf.setFontSize(7.5);
		setColor(pdf, "text", C.text);
		const nx = MARGIN + COL.category;
		const nw = COL.name - 4;
		const ny = y + productGroupHeight / 2;
		const lines = pdf.splitTextToSize(productName, nw);
		const lineH = 4;
		const totalH = Math.min(lines.length, 4) * lineH;
		for (let i = 0; i < Math.min(lines.length, 4); i++) {
			pdf.text(lines[i], nx + 2, ny - totalH / 2 + i * lineH + lineH / 2);
		}
	}

	// ── Variation attributes ──
	setupFont(pdf, fontLoaded);
	pdf.setFontSize(7);
	setColor(pdf, "text", C.text);
	const vx = colX("variation");
	const attrLines = variantAttrs
		.split("\n")
		.flatMap((line) => pdf.splitTextToSize(line, COL.variation - 4));
	const attrLineH = 3.8;
	const attrTotalH = Math.min(attrLines.length, 4) * attrLineH;
	const attrStartY = y + ROW_H / 2 - attrTotalH / 2 + attrLineH / 2;
	for (let i = 0; i < Math.min(attrLines.length, 4); i++) {
		pdf.text(attrLines[i], vx + 2, attrStartY + i * attrLineH);
	}

	// ── Image (only once per color group) ──
	if (showImage) {
		const imgX = colX("image") + IMG_PAD;
		const imgY = y + IMG_PAD;
		if (imageData) {
			try {
				pdf.addImage(
					imageData,
					"JPEG",
					imgX,
					imgY,
					IMG_SIZE,
					IMG_SIZE,
					undefined,
					"FAST",
				);
			} catch {
				drawNoImagePlaceholder(pdf, imgX, imgY, fontLoaded);
			}
		} else {
			drawNoImagePlaceholder(pdf, imgX, imgY, fontLoaded);
		}
	}

	// ── SKU ──
	const sx = colX("sku");
	setupFont(pdf, fontLoaded);
	pdf.setFontSize(6.5);
	setColor(pdf, "text", C.textMuted);
	const skuLines = pdf.splitTextToSize(sku || "—", COL.sku - 4);
	const skuLineH = 3.5;
	const skuStartY =
		y +
		ROW_H / 2 -
		(Math.min(skuLines.length, 2) * skuLineH) / 2 +
		skuLineH / 2;
	for (let i = 0; i < Math.min(skuLines.length, 2); i++) {
		pdf.text(skuLines[i], sx + 2, skuStartY + i * skuLineH);
	}

	// ── Stock ──
	const stx = colX("stock");
	pdf.setFontSize(8);
	setColor(pdf, "text", stock > 0 ? C.text : [185, 28, 28]);
	pdf.text(String(stock), stx + COL.stock / 2, y + ROW_H / 2 + 1.5, {
		align: "center",
	});

	// ── Price ──
	const px = colX("price");
	const hasDis = discountPercent > 0;
	if (hasDis) {
		// Discount badge
		const badgeW = COL.price - 4;
		const badgeH = 5;
		setColor(pdf, "fill", C.discountBg);
		pdf.rect(px + 2, y + 2, badgeW, badgeH, "F");
		pdf.setFontSize(6.5);
		setColor(pdf, "text", C.discountText);
		pdf.text(
			`−${discountPercent}% indirim`,
			px + 2 + badgeW / 2,
			y + 2 + badgeH / 2 + 2,
			{ align: "center" },
		);

		// Original price (strikethrough effect: draw line manually)
		pdf.setFontSize(7.5);
		setColor(pdf, "text", C.textMuted);
		const origText = `€${basePrice.toFixed(2)}`;
		const origY = y + ROW_H / 2 + 0.5;
		pdf.text(origText, px + 2, origY);
		const origW = pdf.getTextWidth(origText);
		setColor(pdf, "draw", C.textMuted);
		pdf.setLineWidth(0.3);
		pdf.line(px + 2, origY - 1.2, px + 2 + origW, origY - 1.2);

		// Discounted price
		pdf.setFontSize(9);
		setColor(pdf, "text", C.discountedPrice);
		pdf.text(`€${finalPrice.toFixed(2)}`, px + 2, y + ROW_H - 4.5);
	} else {
		pdf.setFontSize(9);
		setColor(pdf, "text", C.text);
		pdf.text(`€${basePrice.toFixed(2)}`, px + 2, y + ROW_H / 2 + 1.5);
	}

	// ── Cell borders ──
	// Outer row border
	setColor(pdf, "draw", C.border);
	pdf.setLineWidth(0.15);
	pdf.line(MARGIN, y, MARGIN + USABLE_W, y); // top
	pdf.line(MARGIN, y + ROW_H, MARGIN + USABLE_W, y + ROW_H); // bottom
	pdf.line(MARGIN, y, MARGIN, y + ROW_H); // left
	pdf.line(MARGIN + USABLE_W, y, MARGIN + USABLE_W, y + ROW_H); // right

	// Column dividers (only for variant columns)
	let cx = colX("variation");
	for (const key of ["variation", "image", "sku", "stock"] as const) {
		cx += COL[key];
		pdf.line(cx, y, cx, y + ROW_H);
	}

	// Product-section column divider (after category column)
	if (showProductInfo) {
		const catEndX = MARGIN + COL.category;
		pdf.line(catEndX, y, catEndX, y + productGroupHeight);
		const nameEndX = catEndX + COL.name;
		pdf.line(nameEndX, y, nameEndX, y + productGroupHeight);
	}
}

function drawNoImagePlaceholder(
	pdf: jsPDF,
	x: number,
	y: number,
	fontLoaded: boolean,
) {
	setColor(pdf, "fill", C.noImage);
	pdf.rect(x, y, IMG_SIZE, IMG_SIZE, "F");
	setColor(pdf, "draw", C.border);
	pdf.setLineWidth(0.2);
	pdf.rect(x, y, IMG_SIZE, IMG_SIZE);
	setupFont(pdf, fontLoaded);
	pdf.setFontSize(5.5);
	setColor(pdf, "text", C.textMuted);
	pdf.text("Görsel yok", x + IMG_SIZE / 2, y + IMG_SIZE / 2 + 1, {
		align: "center",
	});
}

function addPageNumbers(pdf: jsPDF, fontLoaded: boolean) {
	const totalPages = pdf.getNumberOfPages();
	for (let i = 1; i <= totalPages; i++) {
		pdf.setPage(i);
		setupFont(pdf, fontLoaded);
		pdf.setFontSize(7);
		setColor(pdf, "text", C.textMuted);
		pdf.text(`${i} / ${totalPages}`, PAGE_W / 2, PAGE_H - 5, {
			align: "center",
		});
	}
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function generateProductCataloguePDF(
	products: ProductForPDF[],
	options: CataloguePDFOptions,
): Promise<Buffer> {
	if (!products || products.length === 0) {
		throw new Error("No products provided for PDF generation");
	}

	const exportDate = options.exportDate ?? new Date();

	// Load font (optional, falls back to helvetica)
	const fontBase64 = await loadFont();
	const fontLoaded = fontBase64 !== null;

	// Pre-fetch all images in parallel
	const imageCache = await prefetchImages(products);

	// Create PDF
	const pdf = new jsPDF("p", "mm", "a4");

	if (fontLoaded && fontBase64) {
		pdf.addFileToVFS("NotoSans_Condensed-Bold.ttf", fontBase64);
		pdf.addFont("NotoSans_Condensed-Bold.ttf", "NotoSans", "bold");
	}

	let currentY = MARGIN;

	// Document header
	drawDocumentHeader(pdf, currentY, exportDate, fontLoaded);
	currentY += HEADER_H;

	// Table header
	drawTableHeader(pdf, currentY, fontLoaded);
	currentY += TABLE_HEADER_H;

	let globalRowIndex = 0;

	for (const product of products) {
		const variants = product.shopifyData?.variants ?? [];
		if (variants.length === 0) continue;

		// Track which color keys have already had their image drawn for this product
		const drawnColorKeys = new Set<string>();

		const categoryName =
			typeof product.category === "object" && product.category !== null
				? (product.category as { name: string }).name
				: "—";
		const categoryId =
			typeof product.category === "object" && product.category !== null
				? String((product.category as { _id: string })._id ?? "")
				: String(product.category ?? "");
		const productId = String(product._id ?? "");

		const productGroupH = variants.length * ROW_H;
		const needsNewPage = currentY + productGroupH > PAGE_H - MARGIN - 10;

		// If entire product group doesn't fit, start new page
		// (but always allow at least one row per page to prevent infinite loop)
		if (needsNewPage && variants.length <= 6) {
			pdf.addPage();
			currentY = MARGIN;
			drawTableHeader(pdf, currentY, fontLoaded);
			currentY += TABLE_HEADER_H;
		}

		for (let vi = 0; vi < variants.length; vi++) {
			const variant = variants[vi];

			// Overflow check per row
			if (currentY + ROW_H > PAGE_H - MARGIN - 10) {
				pdf.addPage();
				currentY = MARGIN;
				drawTableHeader(pdf, currentY, fontLoaded);
				currentY += TABLE_HEADER_H;
			}

			const variantPrice =
				Number.parseFloat(variant.price ?? "") || product.price;
			const { finalPrice, discountPercent } = calculateDiscountedPrice(
				variantPrice,
				options.userId,
				categoryId,
				productId,
				options.discounts,
			);

			// Resolve image — show only once per color group
			const rawImageUrl = variant.image?.url ?? product.images?.[0] ?? "";
			const imageData = rawImageUrl
				? (imageCache.get(rawImageUrl) ?? null)
				: null;
			const colorKey = getColorKey(variant);
			const showImage = !drawnColorKeys.has(colorKey);
			if (showImage) drawnColorKeys.add(colorKey);

			// Build variation attributes string
			const variantAttrs =
				variant.selectedOptions.length > 0
					? variant.selectedOptions
							.map((o) => `${o.name}: ${o.value}`)
							.join("\n")
					: (variant.sku ?? "—");

			// Recalculate product group height relative to current page position
			// (in case product was split across pages, show product info only on first row of each page)
			const showProductInfo = vi === 0;
			const remainingVariants = variants.length - vi;
			const availableOnPage = Math.floor(
				(PAGE_H - MARGIN - 10 - currentY) / ROW_H,
			);
			const visibleOnThisPage = Math.min(remainingVariants, availableOnPage);
			const effectiveGroupH = showProductInfo
				? visibleOnThisPage * ROW_H
				: ROW_H;

			drawVariantRow(pdf, {
				y: currentY,
				isEven: globalRowIndex % 2 === 0,
				category: categoryName,
				productName: product.title,
				showProductInfo,
				productGroupHeight: effectiveGroupH,
				variantAttrs,
				imageData,
				showImage,
				sku: variant.sku ?? product.parentSku ?? "—",
				stock: variant.inventoryQuantity,
				basePrice: variantPrice,
				finalPrice,
				discountPercent,
				fontLoaded,
			});

			currentY += ROW_H;
			globalRowIndex++;
		}

		// Inter-product separator
		setColor(pdf, "draw", C.separatorBorder);
		pdf.setLineWidth(0.4);
		pdf.line(MARGIN, currentY, MARGIN + USABLE_W, currentY);
	}

	addPageNumbers(pdf, fontLoaded);

	return Buffer.from(pdf.output("arraybuffer"));
}
