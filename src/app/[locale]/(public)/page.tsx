import { setRequestLocale } from "next-intl/server";
import React from "react";

import ProductList from "@/components/all-products/ProductList";
import CursorPagination from "@/components/shared/CursorPagination";
import { IProduct, ICategory } from "@/models/Product";
import {
  fetchProducts,
  fetchCollections,
  transformShopifyProduct,
  transformShopifyCollection,
  buildProductSearchQuery,
  TransformedProduct,
  TransformedCategory,
} from "@/utils/shopify";

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const AllProducts = async ({ params: { locale }, searchParams }: Props) => {
  setRequestLocale(locale);

  const query = (searchParams.query as string) || "";
  const cursor = (searchParams.cursor as string) || "";
  const before = (searchParams.before as string) || "";
  const category = (searchParams.category as string) || "";
  const currentPage = Number(searchParams.page || 1);

  const itemsPerPage = 20;

  const getProducts = async (): Promise<{
    products: TransformedProduct[];
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    nextCursor?: string;
    previousCursor?: string;
  }> => {
    // Build search query for Shopify GraphQL
    let searchQuery = "";
    if (query) {
      searchQuery = buildProductSearchQuery({ title: query });
    }
    if (category) {
      searchQuery = searchQuery
        ? `${searchQuery} AND collection:${category}`
        : `collection:${category}`;
    }

    // Fetch products using cursor-based pagination
    const fetchOptions: {
      first?: number;
      last?: number;
      after?: string;
      before?: string;
      query?: string;
    } = {
      query: searchQuery || undefined,
    };

    if (before) {
      // Backward pagination
      fetchOptions.last = itemsPerPage;
      fetchOptions.before = before;
    } else {
      // Forward pagination (default)
      fetchOptions.first = itemsPerPage;
      if (cursor) {
        fetchOptions.after = cursor;
      }
    }

    const response = await fetchProducts(fetchOptions);

    // Transform products for compatibility with existing components
    const products = response.products.edges.map((edge) =>
      transformShopifyProduct(edge.node),
    );

    // Get pagination info
    const { hasNextPage, hasPreviousPage, endCursor, startCursor } =
      response.products.pageInfo;

    return {
      products,
      hasNextPage,
      hasPreviousPage,
      nextCursor: hasNextPage ? endCursor : undefined,
      previousCursor: hasPreviousPage ? startCursor : undefined,
    };
  };

  const getCategories = async (): Promise<TransformedCategory[]> => {
    const response = await fetchCollections({
      first: 50, // Fetch more collections to show as categories
    });

    // Transform collections to be used as categories
    const categories = response.collections.edges.map((edge) =>
      transformShopifyCollection(edge.node),
    );

    return categories;
  };

  const [productsData, categoriesData] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const { products, hasNextPage, hasPreviousPage, nextCursor, previousCursor } =
    productsData;
  const categories = categoriesData;

  return (
    <div>
      <ProductList
        products={products as unknown as IProduct[]}
        categories={categories as unknown as ICategory[]}
      />
      <div className="max-w-6xl w-full mx-auto">
        <CursorPagination
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          nextCursor={nextCursor}
          previousCursor={previousCursor}
          currentQuery={query}
          currentCategory={category}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default AllProducts;
