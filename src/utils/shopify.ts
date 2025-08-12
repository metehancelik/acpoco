import {
  shopifyClient,
  GET_PRODUCTS_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_PRODUCT_BY_ID_QUERY,
  GET_PRODUCTS_BY_HANDLE_QUERY,
  GET_PRODUCTS_BY_COLLECTION_QUERY,
} from "@/lib/shopify";

// Types for Shopify data
export interface ShopifyImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

// Plain types for transformed data (compatible with existing interfaces)
export interface TransformedProduct {
  _id: string;
  parentSku: string;
  title: string;
  price: number;
  description: string;
  weight: {
    value: number;
    unit: string;
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  images: string[];
  attributes: { name: string; values: string[] }[];
  category: TransformedCategory;
  estimatedProductionTime?: string;
  shopifyData?: {
    id: string;
    handle: string;
    variants: ShopifyVariant[];
    collections: ShopifyCollection[];
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface TransformedCategory {
  _id: string;
  name: string;
  image: string;
  shopifyData?: {
    id: string;
    handle: string;
    description?: string;
  };
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice: string | null;
  inventoryQuantity: number;
  availableForSale: boolean;
  sku: string | null;
  requiresShipping: boolean;
  taxable: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description?: string;
  image?: ShopifyImage;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  status: string;
  vendor: string;
  productType: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  totalInventory?: number;
  onlineStoreUrl?: string;
  images: {
    edges: { node: ShopifyImage }[];
  };
  variants: {
    edges: { node: ShopifyVariant }[];
  };
  collections: {
    edges: { node: ShopifyCollection }[];
  };
  options?: {
    id: string;
    name: string;
    values: string[];
  }[];
  seo?: {
    title?: string;
    description?: string;
  };
  metafields?: {
    edges: {
      node: {
        id: string;
        namespace: string;
        key: string;
        value: string;
        type: string;
      };
    }[];
  };
}

export interface ProductsResponse {
  products: {
    edges: { node: ShopifyProduct; cursor: string }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

export interface CollectionsResponse {
  collections: {
    edges: { node: ShopifyCollection; cursor: string }[];
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

// Fetch products from Shopify
export async function fetchProducts(
  options: {
    first?: number;
    last?: number;
    after?: string;
    before?: string;
    query?: string;
  } = {},
): Promise<ProductsResponse> {
  const { first, last, after, before, query } = options;
  // eslint-disable-next-line no-console
  console.log(
    "fetchProducts - first:",
    first,
    "last:",
    last,
    "after:",
    after,
    "before:",
    before,
    "query:",
    query,
  );

  try {
    const variables: Record<string, string | number | undefined> = {
      query,
    };

    // Handle forward pagination
    if (first) {
      variables.first = first;
      if (after && after.trim() !== "") {
        variables.after = after;
      }
    }

    // Handle backward pagination
    if (last) {
      variables.last = last;
      if (before && before.trim() !== "") {
        variables.before = before;
      }
    }

    // Default to forward pagination if neither first nor last is specified
    if (!first && !last) {
      variables.first = 10;
    }

    const data = await shopifyClient.request<ProductsResponse>(
      GET_PRODUCTS_QUERY,
      variables,
    );

    return data;
  } catch (error) {
    console.error("Error fetching products from Shopify:", error);
    throw new Error("Failed to fetch products");
  }
}

// Fetch collections from Shopify
export async function fetchCollections(
  options: {
    first?: number;
    after?: string;
    query?: string;
  } = {},
): Promise<CollectionsResponse> {
  const { first = 10, after, query } = options;

  try {
    const data = await shopifyClient.request<CollectionsResponse>(
      GET_COLLECTIONS_QUERY,
      {
        first,
        after,
        query,
      },
    );

    return data;
  } catch (error) {
    console.error("Error fetching collections from Shopify:", error);
    throw new Error("Failed to fetch collections");
  }
}

// Test Shopify connection
export async function testShopifyConnection(): Promise<boolean> {
  try {
    const testQuery = `
      query testConnection {
        shop {
          id
          name
          domain
        }
      }
    `;

    const result = await shopifyClient.request(testQuery);
    // eslint-disable-next-line no-console
    console.log("Shopify connection test successful:", result);

    return true;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Shopify connection test failed:", error);

    return false;
  }
}

// Fetch a specific product by ID
export async function fetchProductById(
  id: string,
): Promise<{ product: ShopifyProduct }> {
  try {
    // eslint-disable-next-line no-console
    console.log("Fetching product by ID:", id);

    const data = await shopifyClient.request<{ product: ShopifyProduct }>(
      GET_PRODUCT_BY_ID_QUERY,
      { id },
    );

    // eslint-disable-next-line no-console
    console.log(
      "Product fetch successful:",
      data.product ? "Found" : "Not found",
    );

    return data;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching product by ID from Shopify:", error);
    // eslint-disable-next-line no-console
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to fetch product");
  }
}

// Fetch a specific product by handle (slug) using products query
export async function fetchProductByHandle(
  handle: string,
): Promise<{ product: ShopifyProduct | null }> {
  try {
    // eslint-disable-next-line no-console
    console.log("Fetching product by handle:", handle);
    const query = `handle:${handle}`;

    const data = await shopifyClient.request<{
      products: { edges: { node: ShopifyProduct }[] };
    }>(GET_PRODUCTS_BY_HANDLE_QUERY, { query, first: 1 });

    const product = data.products.edges[0]?.node || null;
    // eslint-disable-next-line no-console
    console.log(
      "Product fetch by handle successful:",
      product ? "Found" : "Not found",
    );

    return { product };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Error fetching product by handle from Shopify:", error);
    // eslint-disable-next-line no-console
    console.error("Error details:", JSON.stringify(error, null, 2));
    throw new Error("Failed to fetch product");
  }
}

// Fetch products from a specific collection
export async function fetchProductsByCollection(
  collectionId: string,
  options: {
    first?: number;
    after?: string;
  } = {},
): Promise<{
  collection: {
    id: string;
    title: string;
    handle: string;
    products: {
      edges: { node: ShopifyProduct }[];
      pageInfo: {
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        startCursor: string;
        endCursor: string;
      };
    };
  };
}> {
  const { first = 10, after } = options;

  try {
    const data = await shopifyClient.request<{
      collection: {
        id: string;
        title: string;
        handle: string;
        products: {
          edges: { node: ShopifyProduct }[];
          pageInfo: {
            hasNextPage: boolean;
            hasPreviousPage: boolean;
            startCursor: string;
            endCursor: string;
          };
        };
      };
    }>(GET_PRODUCTS_BY_COLLECTION_QUERY, {
      collectionId,
      first,
      after,
    });

    return data;
  } catch (error) {
    console.error("Error fetching products by collection from Shopify:", error);
    throw new Error("Failed to fetch products by collection");
  }
}

// Helper function to transform Shopify products to match IProduct interface
export function transformShopifyProduct(
  product: ShopifyProduct,
): TransformedProduct {
  const firstVariant = product.variants.edges[0]?.node;
  const firstImage = product.images.edges[0]?.node;
  const firstCollection = product.collections.edges[0]?.node;

  return {
    _id: product.id.replace("gid://shopify/Product/", ""), // Remove GraphQL ID prefix
    parentSku:
      product.handle || product.id.replace("gid://shopify/Product/", ""),
    title: product.title,
    price: firstVariant ? parseFloat(firstVariant.price) : 0,
    description: product.description || "",
    weight: {
      value: 0, // Weight not available from current GraphQL query
      unit: "g",
    },
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      unit: "cm",
    },
    images: product.images.edges.map((edge) => edge.node.url),
    attributes: [
      {
        name: "vendor",
        values: [product.vendor],
      },
      {
        name: "product_type",
        values: [product.productType],
      },
      {
        name: "tags",
        values: product.tags,
      },
    ],
    category: firstCollection
      ? {
          _id: firstCollection.id.replace("gid://shopify/Collection/", ""),
          name: firstCollection.title,
          image: firstImage?.url || "",
        }
      : {
          _id: "uncategorized",
          name: "Uncategorized",
          image: "",
        },
    estimatedProductionTime: undefined,
    // Keep Shopify-specific data for reference
    shopifyData: {
      id: product.id,
      handle: product.handle,
      variants: product.variants.edges.map((edge) => edge.node),
      collections: product.collections.edges.map((edge) => edge.node),
      status: product.status,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    },
  };
}

// Helper function to transform Shopify collections to match ICategory interface
export function transformShopifyCollection(
  collection: ShopifyCollection,
): TransformedCategory {
  return {
    _id: collection.id.replace("gid://shopify/Collection/", ""), // Remove GraphQL ID prefix
    name: collection.title,
    image: collection.image?.url || "",
    // Keep Shopify-specific data for reference
    shopifyData: {
      id: collection.id,
      handle: collection.handle,
      description: collection.description,
    },
  };
}

// Helper function to build search queries for products
export function buildProductSearchQuery(filters: {
  title?: string;
  vendor?: string;
  productType?: string;
  tag?: string;
  status?: "ACTIVE" | "ARCHIVED" | "DRAFT";
}) {
  const queryParts: string[] = [];

  if (filters.title) {
    queryParts.push(`title:*${filters.title}*`);
  }
  if (filters.vendor) {
    queryParts.push(`vendor:${filters.vendor}`);
  }
  if (filters.productType) {
    queryParts.push(`product_type:${filters.productType}`);
  }
  if (filters.tag) {
    queryParts.push(`tag:${filters.tag}`);
  }
  if (filters.status) {
    queryParts.push(`status:${filters.status}`);
  }

  return queryParts.join(" AND ");
}
