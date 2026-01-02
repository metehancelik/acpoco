import fs from "node:fs";
import path from "node:path";

import { format } from "date-fns";
import jsPDF from "jspdf";

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
		console.error(`Error loading font ${fontPath}:`, error);
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

		// Define card dimensions and layout - 6 items per page (2 columns x 3 rows)
		const cardsPerRow = 2;
		const cardsPerColumn = 3;
		const cardsPerPage = cardsPerRow * cardsPerColumn;
		const cardWidth = pageWidth / cardsPerRow - 10; // 5mm margins on each side
		const cardHeight = pageHeight / cardsPerColumn - 2; // 5mm margins on top/bottom
		const marginX = 5;
		const marginY = 1;

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
					console.error("Error loading image:", error);
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
			const x = marginX + colIndex * (cardWidth + 5);
			const y = marginY + rowIndex * (cardHeight + 5);

			// Draw card border
			pdf.setDrawColor(0);
			pdf.setLineWidth(0.5);
			pdf.rect(x, y, cardWidth, cardHeight);

			// Extract item data
			const { item, orderNumber, advancedOptions, orderDate, order } =
				allOrderItems[i];

			// Set font for header
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(10);

			// Draw header with customer name, order number and date
			const dateFormatted = format(orderDate, "dd.MM.yyyy HH:mm:ss");
			const storeName = advancedOptions?.storeId?.storeName || "Unknown Store";
			const header = `${storeName} - ${orderNumber}`;
			pdf.text(header, x + 3, y + 6);
			pdf.text(dateFormatted, x + cardWidth - 3, y + 6, { align: "right" });

			// Draw dividing line below header
			pdf.line(x, y + 9, x + cardWidth, y + 9);

			// Calculate image area
			const imageSize = cardHeight * 0.35;
			const imageX = x + 3;
			const imageY = y + 12;

			// Draw image or placeholder
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
					console.error("Error adding image to PDF:", err);
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
					console.error("Error adding match image to PDF:", err);
					// Fallback to placeholder
					pdf.setFontSize(8);
					pdf.text("No Image", imageX + imageSize / 2, imageY + imageSize / 2, {
						align: "center",
					});
				}
			} else {
				// Draw placeholder for image
				pdf.setFontSize(8);
				pdf.text("No Image", imageX + imageSize / 2, imageY + imageSize / 2, {
					align: "center",
				});
			}

			// Set font for product details
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(9);

			// Product details
			const detailsX = imageX + imageSize + 5;
			let detailsY = imageY + 5;
			const lineHeight = 5;

			// Product name and details
			pdf.setFont("Noto Sans", "bold");
			const productName = item.name || "Unknown Product";
			const displayName =
				productName.length > 30
					? `${productName.substring(0, 30)}...`
					: productName;
			pdf.text(displayName, detailsX, detailsY);
			detailsY += lineHeight;

			pdf.setFont("Noto Sans", "bold");
			if (item.options?.length && order.advancedOptions.source === "etsy") {
				item.options.forEach((option: { name: string; value: string }) => {
					if (option.name && option.value) {
						pdf.text(`${option.name}: ${option.value}`, detailsX, detailsY);
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
							pdf.text(
								`${option.label}: ${option.option} `,
								detailsX,
								detailsY,
							);
							detailsY += lineHeight;
						}
					},
				);
			}

			pdf.text(`SKU: ${item.sku || "N/A"}`, detailsX, detailsY);
			detailsY += lineHeight;

			pdf.text(`Price: ${item.unitPrice || "N/A"}`, detailsX, detailsY);
			detailsY += lineHeight;

			// Handle personalization with the same logic as customer notes
			const personalization =
				item.options?.find((opt) => opt.name === "Personalization")?.value ===
				"Not requested on this item."
					? "N/A"
					: item.options?.find((opt) => opt.name === "Personalization")
							?.value || "N/A";
			pdf.text("Personalization:", detailsX, detailsY);
			detailsY += lineHeight;

			// Process personalization - handle both explicit newlines and long single lines
			let personalizationLines = personalization.split("\n");

			// If there's only one line and it's long, split it into multiple lines
			if (
				personalizationLines.length === 1 &&
				personalizationLines[0].length > 36
			) {
				const longLine = personalizationLines[0];
				personalizationLines = [];

				for (let i = 0; i < longLine.length; i += 36) {
					personalizationLines.push(longLine.substring(i, i + 36));
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
					personalizationLines[i].length > 36
						? `${personalizationLines[i].substring(0, 34)}...`
						: personalizationLines[i];
				pdf.text(`  ${line}`, detailsX, detailsY);
				detailsY += lineHeight;
			}

			// Show indicator if more lines were truncated
			if (personalizationLines.length > maxPersonalizationLines) {
				pdf.text("  ...", detailsX, detailsY);
				detailsY += lineHeight;
			}

			pdf.setFont("Noto Sans", "bold");
			pdf.text(`Adet: ${item.quantity || 1}`, detailsX, detailsY);
			detailsY += lineHeight;

			pdf.setFont("Noto Sans", "bold");

			// Handle multiline customer notes
			const customerNote = order.customerNotes || "N/A";
			pdf.text("Musteri Notu:", detailsX, detailsY);
			detailsY += lineHeight;

			// Process customer note - handle both explicit newlines and long single lines
			let noteLines = customerNote.split("\n");

			// If there's only one line and it's long, split it into multiple lines
			if (noteLines.length === 1 && noteLines[0].length > 36) {
				const longLine = noteLines[0];
				noteLines = [];

				for (let i = 0; i < longLine.length; i += 36) {
					noteLines.push(longLine.substring(i, i + 36));
				}
			}

			const maxNoteLines = 3; // Limit to avoid overflow

			for (let i = 0; i < Math.min(noteLines.length, maxNoteLines); i++) {
				// Truncate long lines that might still be too long
				const line =
					noteLines[i].length > 36
						? `${noteLines[i].substring(0, 34)}...`
						: noteLines[i];
				pdf.text(`  ${line}`, detailsX, detailsY);
				detailsY += lineHeight;
			}

			// Show indicator if more lines were truncated
			if (noteLines.length > maxNoteLines) {
				pdf.text("  ...", detailsX, detailsY);
				detailsY += lineHeight;
			}

			// Draw dividing line before the bottom section
			const bottomSectionY = y + cardHeight - 25;
			pdf.line(x, bottomSectionY, x + cardWidth, bottomSectionY);

			// Draw country code / region marker in the bottom
			pdf.setFont("Noto Sans", "bold");
			pdf.setFontSize(16);
			const warehouse = order.warehouse || "DE";
			pdf.text(warehouse, x + 20, bottomSectionY + 12, {
				align: "center",
			});

			// Add additional order details on the right side of the bottom section
			pdf.setFontSize(8);
			pdf.setFont("Noto Sans", "bold");
			const standardX = x + 40;
			let standardY = bottomSectionY + 5;

			// Default attributes if none are available
			const defaultAttributes: ProductAttribute[] = [
				{ name: "Material", value: "Gümüş" },
				{ name: "Tip", value: "Tipli Kolye" },
				{ name: "Zincir", value: "Normal Damla 7x5" },
			];

			// Get attributes from allOrderItems or use defaults
			const attributes = allOrderItems[i].attributes || defaultAttributes;

			// Calculate smaller line height if we have many attributes
			const attrLineHeight = attributes.length > 2 ? 3 : 4;

			for (let i = 0; i < attributes.length; i++) {
				const attrName = attributes[i].name || "";
				const attrValue = attributes[i].value || "";

				// Limit the length of attribute text to prevent overflow
				const displayText = `${attrName}: ${attrValue}`;
				const truncatedText =
					displayText.length > 30
						? `${displayText.substring(0, 27)}...`
						: displayText;

				pdf.text(truncatedText, standardX, standardY);
				standardY += attrLineHeight;
			}
		}

		// Return PDF as buffer
		const pdfOutput = pdf.output("arraybuffer");

		return Buffer.from(pdfOutput);
	} catch (error) {
		console.error("PDF generation error:", error);
		throw new Error(
			`Failed to generate PDF: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
