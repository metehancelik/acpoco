import type { IDiscount, IDiscountScope } from "@/models/Discount";

export interface DiscountResult {
	finalPrice: number;
	discountPercent: number;
	appliedDiscount: IDiscount | null;
}

/**
 * Calculate the discounted price for a product.
 * Highest percentage wins (among all applicable user/category/product discounts).
 *
 * @param basePrice - Original price of the product
 * @param userId - ID of the user
 * @param categoryId - ID of the product category
 * @param productId - ID of the product
 * @param activeDiscounts - Array of active discounts to consider
 * @returns Object containing final price, discount percent, and applied discount
 */
export function calculateDiscountedPrice(
	basePrice: number,
	userId: string,
	categoryId: string,
	productId: string,
	activeDiscounts: IDiscount[],
): DiscountResult {
	if (!activeDiscounts || activeDiscounts.length === 0) {
		return {
			finalPrice: basePrice,
			discountPercent: 0,
			appliedDiscount: null,
		};
	}

	// Filter discounts that apply to this item
	const applicableDiscounts = activeDiscounts.filter((discount) => {
		if (!discount.isActive) return false;

		// Check expiration
		if (discount.expiresAt && new Date(discount.expiresAt) < new Date()) {
			return false;
		}

		const scope = discount.scope as IDiscountScope;

		switch (scope.type) {
			case "product":
				return scope.productId?.toString() === productId;
			case "category":
				return scope.categoryId?.toString() === categoryId;
			case "user":
				return scope.userId?.toString() === userId;
			default:
				return false;
		}
	});

	if (applicableDiscounts.length === 0) {
		return {
			finalPrice: basePrice,
			discountPercent: 0,
			appliedDiscount: null,
		};
	}

	// Highest percentage wins
	const bestDiscount = applicableDiscounts.reduce((best, d) =>
		d.percentage > best.percentage ? d : best,
	);
	const discountPercent = Math.min(100, Math.max(0, bestDiscount.percentage));
	const discountedPrice = basePrice * (1 - discountPercent / 100);

	return {
		finalPrice: Math.max(0, Number(discountedPrice.toFixed(2))),
		discountPercent,
		appliedDiscount: bestDiscount,
	};
}

/**
 * Get all applicable discounts for a user.
 * This can be used to pre-fetch discounts for cart display.
 */
export function filterActiveDiscounts(
	discounts: IDiscount[],
	userId: string,
): IDiscount[] {
	const now = new Date();

	return discounts.filter((discount) => {
		if (!discount.isActive) return false;
		if (discount.expiresAt && new Date(discount.expiresAt) < now) return false;

		// Include user-level discounts for this user
		// Also include all category and product discounts (they'll be filtered per-item)
		const scope = discount.scope as IDiscountScope;
		if (scope.type === "user") {
			return scope.userId?.toString() === userId;
		}

		return true; // category and product discounts are filtered per-item
	});
}
