import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** URL-safe slug from category name (e.g. "Running Shoes" → "running-shoes") */
export function slugify(name: string): string {
	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/[^a-z0-9-]/g, "");
}

export function getWarehouseLocation(warehouse: string) {
	switch (warehouse) {
		case "US":
			return "Amerika";
		case "GB":
			return "İngiltere";
		case "DE":
			return "Almanya";
		case "shipEntegra":
			return "ShipEntegra";
		case "seller":
			return "Satıcı(Bana gelsin)";
		default:
			return "Bilinmiyor";
	}
}
