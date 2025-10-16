/**
 * Test helpers for Shopify GraphQL integration
 * These are utility functions to help test the Shopify product functionality
 */

import {
  fetchProductById,
  fetchProductByHandle,
  ShopifyProduct,
} from "./shopify";

/**
 * Test function to fetch a product and log its structure
 * Useful for development and debugging
 */
export async function testShopifyProduct(id: string) {
  try {
    let product: ShopifyProduct | null = null;

    // Try different ID formats
    if (id.startsWith("gid://shopify/Product/") || /^\d+$/.test(id)) {
      const shopifyId = id.startsWith("gid://shopify/Product/")
        ? id
        : `gid://shopify/Product/${id}`;
      const response = await fetchProductById(shopifyId);
      product = response.product;
    } else {
      const response = await fetchProductByHandle(id);
      product = response.product;
    }

    if (!product) {
      console.error("Product not found");

      return null;
    }

    return product;
  } catch (error) {
    console.warn("Error testing Shopify product:", error);

    return null;
  }
}

/**
 * Helper to find variant by selected options
 */
export function findVariantByOptions(
  product: ShopifyProduct,
  selectedOptions: Record<string, string>,
): ShopifyProduct["variants"]["edges"][0]["node"] | null {
  const variant = product.variants.edges.find((edge) => {
    const variant = edge.node;

    return variant.selectedOptions.every(
      (option) => selectedOptions[option.name] === option.value,
    );
  });

  return variant?.node || null;
}

/**
 * Get all available option combinations
 */
export function getAvailableOptionCombinations(product: ShopifyProduct) {
  return product.variants.edges
    .filter(
      (edge) => edge.node.availableForSale && edge.node.inventoryQuantity > 0,
    )
    .map((edge) => {
      const options: Record<string, string> = {};
      edge.node.selectedOptions.forEach((option) => {
        options[option.name] = option.value;
      });

      return {
        variant: edge.node,
        options,
      };
    });
}

/**
 * Validate product data structure
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function validateShopifyProduct(product: any): boolean {
  const requiredFields = [
    "id",
    "title",
    "handle",
    "description",
    "variants",
    "images",
  ];

  for (const field of requiredFields) {
    if (!product[field]) {
      console.error(`Missing required field: ${field}`);

      return false;
    }
  }

  if (!product.variants.edges || !Array.isArray(product.variants.edges)) {
    console.error("Invalid variants structure");

    return false;
  }

  if (!product.images.edges || !Array.isArray(product.images.edges)) {
    console.error("Invalid images structure");

    return false;
  }

  return true;
}
