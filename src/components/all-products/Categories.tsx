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
      {/* <Link href="/products/kupeler">
        <div className="col-span-1 relative text-white rounded-lg h-20 lg:h-40 hover:scale-105 transition-all duration-300 shadow-lg">
          <Image
            src="https://www.angoragumus.com/build/img/collections/02.jpg"
            alt="Küpe"
            fill
            className="object-cover absolute rounded-lg"
          />
          <h1 className="z-10 absolute inset-0 flex items-center justify-center p-4 font-bold text-xs md:text-lg lg:text-2xl">
            KÜPE
          </h1>
          <div className="absolute inset-0 bg-slate-400 opacity-40 rounded-lg"></div>
        </div>
      </Link>
      <Link href="/products/bileklikler">
        <div className="col-span-1 relative text-white rounded-lg h-20 lg:h-40 hover:scale-105 transition-all duration-300 shadow-lg">
          <Image
            src="https://www.angoragumus.com/build/img/collections/angoragumus-kisiye-ozel-bileklik.jpg"
            alt="Category 1"
            fill
            className="object-cover absolute rounded-lg"
          />
          <div className="absolute inset-0 bg-slate-400 opacity-40 rounded-lg"></div>

          <h1 className="z-10 absolute inset-0 flex items-center justify-center p-4 font-bold text-xs md:text-lg lg:text-2xl">
            BİLEKLİK
          </h1>
        </div>
      </Link>
      <button onClick={() => handleCategoryClick("6796141a11ef7d9360a785eb")}>
        <div className="col-span-1 relative text-white rounded-lg h-20 lg:h-40 hover:scale-105 transition-all duration-300 shadow-lg">
          <Image
            src="https://www.angoragumus.com/build/img/collections/05.jpg"
            alt="Category 1"
            fill
            className="object-cover absolute rounded-lg"
          />
          <div className="absolute inset-0 bg-slate-400 opacity-40 rounded-lg"></div>

          <h1 className="z-10 absolute inset-0 flex items-center justify-center p-4 font-bold text-xs md:text-lg lg:text-2xl">
            KOLYE
          </h1>
        </div>
      </button>
      <Link href="/products/halhallar">
        <div className="col-span-1 relative text-white rounded-lg h-20 lg:h-40 hover:scale-105 transition-all duration-300 shadow-lg">
          <Image
            src="https://www.angoragumus.com/dimg/urun/31442235412616025900POC_2566.jpg"
            alt="Category 1"
            fill
            className="object-cover absolute rounded-lg"
          />
          <div className="absolute inset-0 bg-slate-400 opacity-40 rounded-lg"></div>

          <h1 className="z-10 absolute inset-0 flex items-center justify-center p-4 font-bold text-xs md:text-lg lg:text-2xl">
            HALHAL
          </h1>
        </div>
      </Link> */}
    </div>
  );
};

export default Categories;
