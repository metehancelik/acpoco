import type { IDiscount, IDiscountScope } from "@/models/Discount";

export interface DiscountResult {
	finalPrice: number;
	discountPercent: number;
	appliedDiscount: IDiscount | null;
}

/**
 * Calculate the discounted price for a product.
 * Priority: product > category > user (highest specificity wins)
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

	// Priority order: product > category > user
	// Within same priority, pick highest percentage
	const priorityOrder: Record<IDiscountScope["type"], number> = {
		product: 3,
		category: 2,
		user: 1,
	};

	// Sort by priority (descending) and then by percentage (descending)
	const sortedDiscounts = applicableDiscounts.sort((a, b) => {
		const priorityA = priorityOrder[a.scope.type];
		const priorityB = priorityOrder[b.scope.type];

		if (priorityA !== priorityB) {
			return priorityB - priorityA;
		}

		return b.percentage - a.percentage;
	});

	const bestDiscount = sortedDiscounts[0];
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
