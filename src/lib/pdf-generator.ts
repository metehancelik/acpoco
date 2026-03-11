import fs from "node:fs";
import path from "node:path";

import { format } from "date-fns";
import jsPDF from "jspdf";

import { logError } from "@/lib/log-error";
import type {
	OrderWithPopulatedItems,
	PopulatedShipStationOrderItem,
} from "@/lib/shipstation/types";

// Function to load font from file system
async function loadFontAsBase64(fontPath: string): Promise<string> {
	try {
		const fullPath = path.join(process.cwd(), "public", "fonts", fontPath);
		const fontBuffer = fs.readFileSync(fullPath);

		return fontBuffer.toString("base64");
	} catch (error) {
		logError(error);
		// Fallback to a basic font or throw error
		throw new Error(`Could not load font: ${fontPath}`);
	}
}

interface OrderItemForPDF {
	item: PopulatedShipStationOrderItem;
	orderNumber: string;
	advancedOptions: {
		storeId: {
			storeName: string;
		};
	};
	orderDate: Date;
	order: OrderWithPopulatedItems & { _id: string };
	matchImage: string | null;
	attributes: ProductAttribute[] | null;
}

// Define interface for attribute structure
interface ProductAttribute {
	name: string;
	value: string;
}

export async function generateOrdersPDF(
	orders: (OrderWithPopulatedItems & { _id: string })[],
): Promise<Buffer> {
	if (!orders || orders.length === 0) {
		throw new Error("No orders provided for PDF generation");
	}

	try {
		// Create PDF document in portrait orientation (better for product cards)
		const pdf = new jsPDF("p", "mm", "a4");

		// Load Noto Sans fonts from TTF files
		const notoSansBold = await loadFontAsBase64("NotoSans_Condensed-Bold.ttf");

		// Add fonts to PDF
		pdf.addFileToVFS("NotoSans_Condensed-Bold.ttf", notoSansBold);
		pdf.addFont("NotoSans_Condensed-Bold.ttf", "Noto Sans", "bold");

		// Set default font
		pdf.setFont("Noto Sans", "bold");

		const pageWidth = pdf.internal.pageSize.getWidth();
		const pageHeight = pdf.internal.pageSize.getHeight();

		// Color palette
		const colors = {
			primary: [41, 128, 185], // Blue
			secondary: [52, 73, 94], // Dark gray-blue
			accent: [46, 204, 113], // Green
			background: [236, 240, 241], // Light gray
			border: [189, 195, 199], // Medium gray
			text: [44, 62, 80], // Dark text
			textLight: [127, 140, 141], // Light text
			headerBg: [52, 152, 219], // Header blue
		};

		// Define card dimensions and layout - 6 items per page (2 columns x 3 rows)
		const cardsPerRow = 2;
		const cardsPerColumn = 3;
		const cardsPerPage = cardsPerRow * cardsPerColumn;
		const cardWidth = pageWidth / cardsPerRow - 12; // Better margins
		const cardHeight = pageHeight / cardsPerColumn - 4;
		const marginX = 6;
		const marginY = 2;

		// Extract order items from all orders
		const allOrderItems: OrderItemForPDF[] = [];

		orders.forEach((order) => {
			if (order.items && order.items.length > 0) {
				order.items.forEach((item) => {
					// Extract the match image URL and attributes if they exist
					let matchImage = null;
					let attributes: ProductAttribute[] | null = null;

					if (
						item.matchId &&
						typeof item.matchId === "object" &&
						"productId" in item.matchId
					) {
						// Extract images
						if (
							"images" in item.matchId.productId &&
							Array.isArray(item.matchId.productId.images) &&
							item.matchId.productId.images.length > 0
						) {
							matchImage =
								item.matchId?.productId?.images?.[0]
									.replace("[", "")
									.replace("]", "") || null;
						}

						// Extract attributes
						if (
							"attributes" in item.matchId &&
							Array.isArray(item.matchId.attributes)
						) {
							attributes = item.matchId.attributes as ProductAttribute[];
						}
					}

					allOrderItems.push({
						item,
						orderNumber: order.orderNumber,
						advancedOptions: order.advancedOptions as unknown as {
							storeId: {
								storeName: string;
								storeId: number;
							};
						},
						orderDate: new Date(order.orderDate),
						order,
						matchImage,
						attributes,
					});
				});
			}
		});

		if (allOrderItems.length === 0) {
			throw new Error("No order items found for PDF generation");
		}

		// Load all images before processing
		const imagePromises = allOrderItems.map(async ({ item }) => {
			if (item.imageUrl) {
				try {
					const response = await fetch(item.imageUrl);
					if (response.ok) {
						const arrayBuffer = await response.arrayBuffer();
						const buffer = Buffer.from(arrayBuffer);

						return `data:image/jpeg;base64,${buffer.toString("base64")}`;
					}
				} catch (error) {
					logError(error);
				}
			}

			return null;
		});

		const imageResults = await Promise.allSettled(imagePromises);
		const images = imageResults.map((result) =>
			result.status === "fulfilled" ? result.value : null,
		);

		// Process each item
		for (let i = 0; i < allOrderItems.length; i++) {
			const cardIndex = i % cardsPerPage;
			const rowIndex = Math.floor(cardIndex / cardsPerRow);
			const colIndex = cardIndex % cardsPerRow;

			// Add a new page if needed
			if (cardIndex === 0 && i > 0) {
				pdf.addPage();
			}

			// Calculate card position
			const x = marginX + colIndex * (cardWidth + 6);
			const y = marginY + rowIndex * (cardHeight + 4);

			// Draw card border with rounded effect (simulated with lighter color)
			pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
			pdf.setLineWidth(0.3);
			pdf.rect(x, y, cardWidth, cardHeight);

			// Extract item data
			const { item, orderNumber, advancedOptions, orderDate, order } =
				allOrderItems[i];

			// Draw header background
			const headerHeight = 10;
			pdf.setFillColor(
				colors.headerBg[0],
				colors.headerBg[1],
				colors.headerBg[2],
			);
			pdf.rect(x, y, cardWidth, headerHeight, "F");

			// Draw header text
			pdf.setTextColor(255, 255, 255);
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(9);
			const dateFormatted = format(orderDate, "dd.MM.yyyy HH:mm");
			const storeName = advancedOptions?.storeId?.storeName || "Unknown Store";
			const header = `${storeName} - ${orderNumber}`;
			pdf.text(header, x + 4, y + 6.5);
			pdf.setFontSize(7);
			pdf.text(dateFormatted, x + cardWidth - 4, y + 6.5, { align: "right" });

			// Reset text color
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

			// Calculate image area
			const imageSize = cardHeight * 0.32;
			const imageX = x + 4;
			const imageY = y + headerHeight + 3;

			// Draw image border
			pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
			pdf.setLineWidth(0.2);
			pdf.rect(imageX, imageY, imageSize, imageSize);

			const imageDataUrl = images[i];
			const matchImage = allOrderItems[i].matchImage;

			if (imageDataUrl) {
				try {
					pdf.addImage(
						imageDataUrl,
						"JPEG",
						imageX,
						imageY,
						imageSize,
						imageSize,
						"",
						"FAST",
					);
				} catch (err) {
					logError(err);
					// Fallback to placeholder
					pdf.setFontSize(8);
					pdf.text("No Image", imageX + imageSize / 2, imageY + imageSize / 2, {
						align: "center",
					});
				}
			} else if (matchImage) {
				try {
					pdf.addImage(
						matchImage,
						"JPEG",
						imageX,
						imageY,
						imageSize,
						imageSize,
						"",
						"FAST",
					);
				} catch (err) {
					logError(err);
					// Fallback to placeholder
					pdf.setFontSize(8);
					pdf.text("No Image", imageX + imageSize / 2, imageY + imageSize / 2, {
						align: "center",
					});
				}
			} else {
				// Draw placeholder for image with background
				pdf.setFillColor(
					colors.background[0],
					colors.background[1],
					colors.background[2],
				);
				pdf.rect(imageX, imageY, imageSize, imageSize, "F");
				pdf.setTextColor(
					colors.textLight[0],
					colors.textLight[1],
					colors.textLight[2],
				);
				pdf.setFontSize(7);
				pdf.text("No Image", imageX + imageSize / 2, imageY + imageSize / 2, {
					align: "center",
				});
				pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
			}

			// Product details section
			const detailsX = imageX + imageSize + 4;
			let detailsY = imageY + 3;
			const lineHeight = 4.5;

			// Product name with better styling
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(8.5);
			pdf.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
			const productName = item.name || "Unknown Product";
			const displayName =
				productName.length > 28
					? `${productName.substring(0, 28)}...`
					: productName;
			pdf.text(displayName, detailsX, detailsY);
			detailsY += lineHeight + 1;
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
			pdf.setFontSize(7.5);

			// Fixed label width to prevent overlapping
			const labelWidth = 20; // Fixed width for labels in mm
			const valueStartX = detailsX + labelWidth; // Value starts after label area

			// Options with better formatting
			if (item.options?.length && order.advancedOptions.source === "etsy") {
				item.options.forEach((option: { name: string; value: string }) => {
					if (option.name && option.value) {
						pdf.setTextColor(
							colors.textLight[0],
							colors.textLight[1],
							colors.textLight[2],
						);
						pdf.text(`${option.name}:`, detailsX, detailsY);
						pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
						const value =
							option.value.length > 18
								? `${option.value.substring(0, 18)}...`
								: option.value;
						pdf.text(value, valueStartX, detailsY);
						detailsY += lineHeight;
					}
				});
			}
			if (
				order.advancedOptions.source === "amazon" &&
				item.amazonCustomizationOptions?.length
			) {
				item.amazonCustomizationOptions.forEach(
					(option: { label: string; option: string; priceDelta: number }) => {
						if (option.label && option.option) {
							pdf.setTextColor(
								colors.textLight[0],
								colors.textLight[1],
								colors.textLight[2],
							);
							pdf.text(`${option.label}:`, detailsX, detailsY);
							pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
							const value =
								option.option.length > 18
									? `${option.option.substring(0, 18)}...`
									: option.option;
							pdf.text(value, valueStartX, detailsY);
							detailsY += lineHeight;
						}
					},
				);
			}

			// SKU and Price with labels
			pdf.setTextColor(
				colors.textLight[0],
				colors.textLight[1],
				colors.textLight[2],
			);
			pdf.text("SKU:", detailsX, detailsY);
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
			pdf.text(item.sku || "N/A", valueStartX, detailsY);
			detailsY += lineHeight;

			pdf.setTextColor(
				colors.textLight[0],
				colors.textLight[1],
				colors.textLight[2],
			);
			pdf.text("Price:", detailsX, detailsY);
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
			pdf.text(`${item.unitPrice || "N/A"}`, valueStartX, detailsY);
			detailsY += lineHeight + 1;

			// Handle personalization with better styling
			const personalization =
				item.options?.find((opt) => opt.name === "Personalization")?.value ===
				"Not requested on this item."
					? "N/A"
					: item.options?.find((opt) => opt.name === "Personalization")
							?.value || "N/A";

			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(7);
			pdf.setTextColor(
				colors.secondary[0],
				colors.secondary[1],
				colors.secondary[2],
			);
			pdf.text("Personalization:", detailsX, detailsY);
			detailsY += lineHeight - 0.5;
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(7);
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

			// Process personalization - handle both explicit newlines and long single lines
			let personalizationLines = personalization.split("\n");

			// If there's only one line and it's long, split it into multiple lines
			if (
				personalizationLines.length === 1 &&
				personalizationLines[0].length > 32
			) {
				const longLine = personalizationLines[0];
				personalizationLines = [];

				for (let i = 0; i < longLine.length; i += 32) {
					personalizationLines.push(longLine.substring(i, i + 32));
				}
			}

			const maxPersonalizationLines = 2; // Limit to avoid overflow

			for (
				let i = 0;
				i < Math.min(personalizationLines.length, maxPersonalizationLines);
				i++
			) {
				// Truncate long lines that might still be too long
				const line =
					personalizationLines[i].length > 32
						? `${personalizationLines[i].substring(0, 30)}...`
						: personalizationLines[i];
				pdf.text(`  ${line}`, detailsX, detailsY);
				detailsY += lineHeight - 0.5;
			}

			// Show indicator if more lines were truncated
			if (personalizationLines.length > maxPersonalizationLines) {
				pdf.text("  ...", detailsX, detailsY);
				detailsY += lineHeight;
			}

			detailsY += 1;

			// Quantity with badge style
			pdf.setFillColor(colors.accent[0], colors.accent[1], colors.accent[2]);
			pdf.rect(detailsX - 1, detailsY - 3, 15, 5, "F");
			pdf.setTextColor(255, 255, 255);
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(7);
			pdf.text(`Qty: ${item.quantity || 1}`, detailsX + 1, detailsY);
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
			detailsY += lineHeight + 2;

			// Customer notes section
			const customerNote = order.customerNotes || "N/A";
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(7);
			pdf.setTextColor(
				colors.secondary[0],
				colors.secondary[1],
				colors.secondary[2],
			);
			pdf.text("Musteri Notu:", detailsX, detailsY);
			detailsY += lineHeight - 0.5;
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(7);
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

			// Process customer note - handle both explicit newlines and long single lines
			let noteLines = customerNote.split("\n");

			// If there's only one line and it's long, split it into multiple lines
			if (noteLines.length === 1 && noteLines[0].length > 32) {
				const longLine = noteLines[0];
				noteLines = [];

				for (let i = 0; i < longLine.length; i += 32) {
					noteLines.push(longLine.substring(i, i + 32));
				}
			}

			const maxNoteLines = 2; // Limit to avoid overflow

			for (let i = 0; i < Math.min(noteLines.length, maxNoteLines); i++) {
				// Truncate long lines that might still be too long
				const line =
					noteLines[i].length > 32
						? `${noteLines[i].substring(0, 30)}...`
						: noteLines[i];
				pdf.text(`  ${line}`, detailsX, detailsY);
				detailsY += lineHeight - 0.5;
			}

			// Show indicator if more lines were truncated
			if (noteLines.length > maxNoteLines) {
				pdf.text("  ...", detailsX, detailsY);
				detailsY += lineHeight;
			}

			// Draw dividing line before the bottom section with better styling
			const bottomSectionY = y + cardHeight - 22;
			pdf.setDrawColor(colors.border[0], colors.border[1], colors.border[2]);
			pdf.setLineWidth(0.3);
			pdf.line(x + 2, bottomSectionY, x + cardWidth - 2, bottomSectionY);

			// Draw country code / region marker in the bottom with badge style
			const warehouse = order.warehouse || "DE";
			const badgeSize = 12;
			const badgeX = x + 5;
			const badgeY = bottomSectionY + 3;

			// Draw badge background
			pdf.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
			pdf.rect(badgeX, badgeY, badgeSize, badgeSize, "F");

			// Draw badge text
			pdf.setTextColor(255, 255, 255);
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(10);
			pdf.text(warehouse, badgeX + badgeSize / 2, badgeY + badgeSize / 2 + 2, {
				align: "center",
			});

			// Add additional order details on the right side of the bottom section
			pdf.setFontSize(7);
			pdf.setFont("Noto Sans", "bold");
			pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
			const standardX = x + badgeX + badgeSize + 3;
			let standardY = bottomSectionY + 4;

			// Fixed label width for attributes to prevent overlapping
			const attrLabelWidth = 15; // Fixed width for attribute labels in mm
			const attrValueStartX = standardX + attrLabelWidth; // Value starts after label area

			// Default attributes if none are available
			const defaultAttributes: ProductAttribute[] = [
				{ name: "Material", value: "Gümüş" },
				{ name: "Tip", value: "Tipli Kolye" },
				{ name: "Zincir", value: "Normal Damla 7x5" },
			];

			// Get attributes from allOrderItems or use defaults
			const attributes = allOrderItems[i].attributes || defaultAttributes;

			// Calculate smaller line height if we have many attributes
			const attrLineHeight = attributes.length > 2 ? 3.5 : 4;

			for (let j = 0; j < attributes.length; j++) {
				const attrName = attributes[j].name || "";
				const attrValue = attributes[j].value || "";

				// Better formatting with label and value separation
				pdf.setTextColor(
					colors.textLight[0],
					colors.textLight[1],
					colors.textLight[2],
				);
				pdf.text(`${attrName}:`, standardX, standardY);
				pdf.setTextColor(colors.text[0], colors.text[1], colors.text[2]);

				// Limit the length of attribute value to prevent overflow
				const maxValueLength = 18;
				const displayValue =
					attrValue.length > maxValueLength
						? `${attrValue.substring(0, maxValueLength - 3)}...`
						: attrValue;

				pdf.text(displayValue, attrValueStartX, standardY);
				standardY += attrLineHeight;
			}
		}

		// Return PDF as buffer
		const pdfOutput = pdf.output("arraybuffer");

		return Buffer.from(pdfOutput);
	} catch (error) {
		logError(error);
		throw new Error(
			`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
