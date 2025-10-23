import ShopifyProductClient from "@/components/product-details/ShopifyProductClient";
import { ShopifyVariant } from "@/utils/shopify";

const ProductPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // API base URL
  const baseUrl =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

  let product;

  try {
    // Fetch product from database
    const response = await fetch(`${baseUrl}/catalog/${id}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const result = await response.json();

    if (!result.success) {
      throw new Error(result.error || "Product not found");
    }

    product = result.data;
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
    initialVariant = product.variants.edges.find((edge: any) => {
      const variant = edge.node;

      return variant.selectedOptions.every(
        (option: any) => searchOptions[option.name] === option.value,
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
