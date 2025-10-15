"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

import { ICategory } from "@/models/Product";

type Props = {
  categories: ICategory[];
};
const Categories = ({ categories }: Props) => {
  const router = useRouter();

  const handleCategoryClick = (category: string) => {
    router.push(`?category=${category}`);
  };

  return (
    <div className="grid grid-cols-5 gap-2 lg:gap-6 pb-12">
      {categories?.map((category) => (
        <button
          key={category._id}
          onClick={() => handleCategoryClick(category._id)}
        >
          <div className="col-span-1 relative text-white rounded-lg h-20 lg:h-40 hover:scale-105 transition-all duration-300 shadow-lg">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover absolute rounded-lg"
            />
            <div className="absolute inset-0 bg-slate-400 opacity-40 rounded-lg"></div>

            <h1 className="z-10 absolute inset-0 flex items-center justify-center p-4 font-bold text-xs md:text-lg lg:text-2xl">
              {category.name.toUpperCase()}
            </h1>
          </div>
        </button>
      ))}
    </div>
  );
};

export default Categories;
