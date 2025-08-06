import { setRequestLocale } from "next-intl/server";
import React from "react";

import ProductList from "@/components/all-products/ProductList";
import Pagination from "@/components/shared/Pagination";
import axios from "@/utils/httpClient";

type Props = {
  params: { locale: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

const AllProducts = async ({ params: { locale }, searchParams }: Props) => {
  setRequestLocale(locale);

  const query = searchParams.query || "";
  const page = Number(searchParams.page) || 1;
  const category = searchParams.category || "";
  const searchQuery = `query=${query}&page=${page}&category=${category}`;

  const getProducts = async () => {
    const res = await axios.get(`/products/catalogue?${searchQuery}`);

    return res.data;
  };

  const getCategories = async () => {
    const res = await axios.get(`/categories`);

    return res.data;
  };

  const productsData = await getProducts();
  const categoriesData = await getCategories();
  const [{ products, pageCount }, categories] = await Promise.all([
    productsData,
    categoriesData,
  ]);

  return (
    <div>
      <ProductList products={products} categories={categories} />
      <div className="max-w-6xl w-full mx-auto">
        <Pagination totalPages={pageCount} />
      </div>
    </div>
  );
};

export default AllProducts;
