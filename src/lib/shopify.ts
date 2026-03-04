import { GraphQLClient } from "graphql-request";

// Shopify GraphQL Admin API configuration
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;

if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_ADMIN_ACCESS_TOKEN) {
	throw new Error("Missing required Shopify environment variables");
}

// Create GraphQL client for Shopify Admin API
export const shopifyClient = new GraphQLClient(
	`https://${SHOPIFY_STORE_DOMAIN}/admin/api/2024-10/graphql.json`,
	{
		headers: {
			"X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
			"Content-Type": "application/json",
		},
	},
);

// GraphQL query for fetching products
export const GET_PRODUCTS_QUERY = `
  query getProducts($first: Int, $last: Int, $after: String, $before: String, $query: String) {
    products(first: $first, last: $last, after: $after, before: $before, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          status
          vendor
          productType
          createdAt
          updatedAt
          tags
          images(first: 250) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                inventoryQuantity
                availableForSale
                sku
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
                image {
                  url
                  altText
                }
              }
            }
          }
          options {
            id
            name
            values
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// GraphQL query for fetching collections
export const GET_COLLECTIONS_QUERY = `
  query getCollections($first: Int!, $after: String, $query: String) {
    collections(first: $first, after: $after, query: $query) {
      edges {
        node {
          id
          title
          handle
          description
          updatedAt
          image {
            id
            url
            altText
            width
            height
          }
          products(first: 250) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// GraphQL query for fetching a specific product by ID with detailed variant information
export const GET_PRODUCT_BY_ID_QUERY = `
  query getProduct($id: ID!) {
    product(id: $id) {
      id
      title
      handle
      description
      descriptionHtml
      status
      vendor
      productType
      createdAt
      updatedAt
      tags
      totalInventory
      onlineStoreUrl
      images(first: 250) {
        edges {
          node {
            id
            url
            altText
            width
            height
          }
        }
      }
      variants(first: 250) {
        edges {
          node {
            id
            title
            price
            compareAtPrice
            inventoryQuantity
            availableForSale
            sku
            selectedOptions {
              name
              value
            }
            image {
              id
              url
              altText
              width
              height
            }
          }
        }
      }
      options {
        id
        name
        values
      }
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
      seo {
        title
        description
      }
      metafields(first: 10) {
        edges {
          node {
            id
            namespace
            key
            value
            type
          }
        }
      }
    }
  }
`;

// GraphQL query for fetching products by handle using the products query
export const GET_PRODUCTS_BY_HANDLE_QUERY = `
  query getProductsByHandle($query: String!, $first: Int!) {
    products(query: $query, first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          descriptionHtml
          status
          vendor
          productType
          createdAt
          updatedAt
          tags
          totalInventory
          onlineStoreUrl
          images(first: 250) {
            edges {
              node {
                id
                url
                altText
                width
                height
              }
            }
          }
          variants(first: 250) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                inventoryQuantity
                availableForSale
                sku
                requiresShipping
                taxable
                selectedOptions {
                  name
                  value
                }
                image {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          options {
            id
            name
            values
          }
          collections(first: 10) {
            edges {
              node {
                id
                title
                handle
              }
            }
          }
          seo {
            title
            description
          }
          metafields(first: 10) {
            edges {
              node {
                id
                namespace
                key
                value
                type
              }
            }
          }
        }
      }
    }
  }
`;

// GraphQL query for fetching products by collection
export const GET_PRODUCTS_BY_COLLECTION_QUERY = `
  query getProductsByCollection($collectionId: ID!, $first: Int!, $after: String) {
    collection(id: $collectionId) {
      id
      title
      handle
      products(first: $first, after: $after) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            vendor
            productType
            images(first: 250) {
              edges {
                node {
                  id
                  url
                  altText
                  width
                  height
                }
              }
            }
            variants(first: 250) {
              edges {
                node {
                  id
                  title
                  price
                  compareAtPrice
                  availableForSale
                  sku
                }
              }
            }
            collections(first: 10) {
              edges {
                node {
                  id
                  title
                  handle
                }
              }
            }
            options {
              id
              name
              values
            }
          }
        }
        pageInfo {
          hasNextPage
          hasPreviousPage
          startCursor
          endCursor
        }
      }
    }
  }
`;

// Inventory helpers

const SHOPIFY_GERMANY_LOCATION_ID = process.env.SHOPIFY_GERMANY_LOCATION_ID;

const GET_VARIANT_BY_SKU_QUERY = `
  query getVariantBySku($query: String!) {
    productVariants(first: 1, query: $query) {
      edges {
        node {
          id
          sku
          inventoryItem {
            id
          }
        }
      }
    }
  }
`;

const GET_VARIANT_BY_ID_QUERY = `
  query getVariantById($id: ID!) {
    productVariant(id: $id) {
      id
      inventoryItem {
        id
      }
    }
  }
`;

const GET_INVENTORY_LEVEL_QUERY = `
  query getInventoryLevel($inventoryItemId: ID!, $locationId: ID!) {
    inventoryItem(id: $inventoryItemId) {
      inventoryLevel(locationId: $locationId) {
        quantities(names: ["available"]) {
          name
          quantity
        }
      }
    }
  }
`;

const INVENTORY_SET_MUTATION = `
  mutation inventorySet($input: InventorySetQuantitiesInput!) {
    inventorySetQuantities(input: $input) {
      inventoryAdjustmentGroup {
        createdAt
        reason
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

const MAX_CAS_RETRIES = 3;

export function getGermanyLocationId(): string {
	if (!SHOPIFY_GERMANY_LOCATION_ID) {
		throw new Error(
			"SHOPIFY_GERMANY_LOCATION_ID environment variable is not set. " +
				"Set it to your Shopify Germany location GID (e.g. gid://shopify/Location/12345678).",
		);
	}
	return SHOPIFY_GERMANY_LOCATION_ID;
}

export async function getInventoryItemIdBySku(
	sku: string,
): Promise<string | null> {
	const query = `sku:${sku}`;
	type ProductVariants = {
		productVariants: {
			edges: Array<{ node: { inventoryItem: { id: string } | null } }>;
		};
	};
	const data = await shopifyClient.request<ProductVariants>(
		GET_VARIANT_BY_SKU_QUERY,
		{ query },
	);
	const edge = data.productVariants.edges[0];
	if (edge?.node.inventoryItem?.id) {
		return edge.node.inventoryItem.id;
	}

	// childSku may be a Shopify variant ID (fallback when variant has no SKU)
	if (/^\d+$/.test(sku)) {
		const variantGid = `gid://shopify/ProductVariant/${sku}`;
		const variantData = await shopifyClient.request<{
			productVariant: {
				inventoryItem: { id: string } | null;
			} | null;
		}>(GET_VARIANT_BY_ID_QUERY, { id: variantGid });
		return variantData.productVariant?.inventoryItem?.id ?? null;
	}

	return null;
}

async function getAvailableQuantity(
	inventoryItemId: string,
	locationId: string,
): Promise<number | null> {
	const data = await shopifyClient.request<{
		inventoryItem: {
			inventoryLevel: {
				quantities: Array<{ name: string; quantity: number }>;
			} | null;
		} | null;
	}>(GET_INVENTORY_LEVEL_QUERY, { inventoryItemId, locationId });

	const level = data.inventoryItem?.inventoryLevel;
	if (!level) return null;

	const available = level.quantities.find((q) => q.name === "available");
	return available?.quantity ?? null;
}

/**
 * Adjusts inventory for a SKU at the Germany location only.
 * Uses compare-and-swap (compareQuantity) to prevent race conditions
 * and rejects any adjustment that would result in negative stock.
 */
export async function adjustInventoryBySku(
	sku: string,
	delta: number,
): Promise<{ ok: boolean; error?: string }> {
	try {
		const locationId = getGermanyLocationId();
		const inventoryItemId = await getInventoryItemIdBySku(sku);

		if (!inventoryItemId) {
			return { ok: false, error: `Inventory item not found for SKU ${sku}` };
		}

		for (let attempt = 0; attempt < MAX_CAS_RETRIES; attempt++) {
			const currentQty = await getAvailableQuantity(
				inventoryItemId,
				locationId,
			);
			if (currentQty === null) {
				return {
					ok: false,
					error: `No inventory level at Germany location for SKU ${sku}`,
				};
			}

			const newQty = currentQty + delta;
			if (newQty < 0) {
				return {
					ok: false,
					error: `Insufficient stock for SKU ${sku}: available=${currentQty}, requested=${Math.abs(delta)}`,
				};
			}

			const result = await shopifyClient.request<{
				inventorySetQuantities: {
					userErrors: Array<{
						field: string[] | null;
						message: string;
						code: string | null;
					}>;
				};
			}>(INVENTORY_SET_MUTATION, {
				input: {
					name: "available",
					reason: "correction",
					quantities: [
						{
							inventoryItemId,
							locationId,
							quantity: newQty,
							compareQuantity: currentQty,
						},
					],
				},
			} as unknown as Record<string, unknown>);

			const errors = result.inventorySetQuantities?.userErrors || [];
			if (errors.length === 0) {
				return { ok: true };
			}

			const isCasConflict = errors.some(
				(e) =>
					e.code === "QUANTITY_COMPARE_MISMATCH" ||
					e.message?.toLowerCase().includes("quantity has changed") ||
					e.message?.toLowerCase().includes("compare"),
			);

			if (isCasConflict && attempt < MAX_CAS_RETRIES - 1) {
				continue;
			}

			return { ok: false, error: errors.map((e) => e.message).join("; ") };
		}

		return {
			ok: false,
			error: `Inventory for SKU ${sku} changed concurrently after ${MAX_CAS_RETRIES} retries`,
		};
	} catch (error) {
		return { ok: false, error: (error as Error).message };
	}
}
