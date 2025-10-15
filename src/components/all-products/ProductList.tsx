import React from "react";

import { ICategory, IProduct } from "@/models/Product";

import Categories from "./Categories";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";



type Props = {
  products: IProduct[];
  categories: ICategory[];
};
const ProductList = ({ products, categories }: Props) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 lg:px-0 py-8 lg:py-16 lg:max-w-6xl">
        <Categories categories={categories} />
        <ProductFilter />
        <div className="grid grid-cols-2 gap-x-2 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-8">
          {products?.map((product: IProduct) => (
            <ProductCard product={product} key={product._id} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
