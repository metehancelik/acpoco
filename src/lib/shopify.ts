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
          status
          vendor
          productType
          createdAt
          updatedAt
          tags
          images(first: 10) {
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
          variants(first: 10) {
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
          products(first: 10) {
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
      status
      vendor
      productType
      createdAt
      updatedAt
      tags
      totalInventory
      onlineStoreUrl
      images(first: 20) {
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
      variants(first: 100) {
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
          status
          vendor
          productType
          createdAt
          updatedAt
          tags
          totalInventory
          onlineStoreUrl
          images(first: 20) {
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
          variants(first: 100) {
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
            vendor
            productType
            images(first: 5) {
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
            variants(first: 5) {
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
