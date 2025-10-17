import ShopifyProductClient from "@/components/product-details/ShopifyProductClient";
import {
  fetchProductById,
  fetchProductByHandle,
  ShopifyVariant,
} from "@/utils/shopify";

const ProductPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  let product;

  try {
    // Try to fetch as Shopify product ID first
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
  } catch (error) {
    console.error("Error fetching product:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack trace",
    );
    throw new Error(
      `Product not found: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    );
  }

  if (!product) {
    console.error("Product is null after fetch attempt");
    throw new Error("Product not found - no product data returned");
  }

  // Find initial variant based on search params
  let initialVariant: ShopifyVariant | undefined;

  if (
    Object.keys(searchParams).length > 0 &&
    product.variants?.edges.length > 0
  ) {
    // Convert search params to expected format
    const searchOptions: Record<string, string> = {};
    Object.entries(searchParams).forEach(([key, value]) => {
      if (typeof value === "string") {
        searchOptions[key] = value;
      } else if (Array.isArray(value) && value.length > 0) {
        searchOptions[key] = value[0];
      }
    });

    // Find matching variant
    initialVariant = product.variants.edges.find((edge) => {
      const variant = edge.node;

      return variant.selectedOptions.every(
        (option) => searchOptions[option.name] === option.value,
      );
    })?.node;
  }

  // Fallback to first available variant
  if (!initialVariant && product.variants?.edges.length > 0) {
    initialVariant = product.variants.edges[0].node;
  }

  return (
    <ShopifyProductClient product={product} initialVariant={initialVariant} />
  );
};

export default ProductPage;
