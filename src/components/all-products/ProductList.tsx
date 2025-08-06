import React from "react";

import { ICategory, IProduct } from "@/models/Product";

import Categories from "./Categories";
import ProductCard from "./ProductCard";
import ProductFilter from "./ProductFilter";

// const products = [
//   {
//     _id: "ajhlsbdlkjasbd",
//     title: "AG-KK0028-EL Kişiselleştirilmiş El İzi Kolye",
//     sku: "AG-KK0028-EL",
//     price: 24,
//     description:
//       "925 Ayar Gümüş En uzunluğu: 2 cm Boy uzunluğu: 2 cm Kaplama : Rose - Gold - Silver",
//     image:
//       "https://www.angoragumus.com/dimg/urun/2417220953258842870626583254482575328311RAW%20(35015%20of%201)_600x600.jpg",
//   },
//   {
//     _id: "ajhsdkajsdoışashı",
//     title: "AG-KK0034 Medical Disk Kolye",
//     sku: "AG-KK0034",
//     price: 32,
//     image:
//       "https://www.angoragumus.com/dimg/urun/287003010429161244332474526236297773128500314%20(1).jpg",
//   },
//   {
//     _id: "ajhsdkajsdoışashı",
//     title: "AG-KK0050-5 Sevdiklerim Bir Yerde Disk Kolye Beşli",
//     sku: "AG-KK0050-5",
//     price: 32,
//     image:
//       "https://www.angoragumus.com/dimg/urun/2331928241253262753329919273372086428509New%20Project%20(78).jpg",
//   },
//   {
//     _id: "aasdddd",
//     title: "AG-KK0004 Mini Harf Kolyeler",
//     sku: "AG-KK0004",
//     price: 42,
//     image:
//       "https://www.angoragumus.com/dimg/urun/28733219002708425732910A6228.JPG",
//   },
//   {
//     _id: "aasssssssss",
//     title: "AG-KK0005 3D Bar Kolye",
//     sku: "AG-KK0005",
//     price: 32,
//     image:
//       "https://www.angoragumus.com/dimg/urun/22063218352065527362il_794xN.3753042296_2xst.jpg",
//   },
//   {
//     _id: "afdfdaffaaffa",
//     title: "AG-KK0063 Yonca- İsim Kolye",
//     sku: "AG-KK0063",
//     price: 32,
//     image:
//       "https://www.angoragumus.com/dimg/urun/24940277782646129287Yoncal%C4%B1%20%C4%B0simli%20Kolye%20lazer.jpg",
//   },
//   {
//     _id: "afdfdaffaaa",
//     title: "AG-KY-003 Çift İsimli Yüzük",
//     sku: "AG-KY-003",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/28399315572681923808910A6328.JPG",
//   },
//   {
//     _id: "afdfdaffaaa3",
//     title: "AG-KY-005 Kalpli Yüzük",
//     sku: "AG-KY-005",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/25359300192036129634New%20Project%20(96).jpg",
//   },
//   {
//     _id: "afdfdaffaa3a3",
//     title: "AG-KY-008 Kişiselleştirilmiş Kalp Yüzük",
//     sku: "AG-KY-008",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/31919292832934931249POC_5688.jpg",
//   },
//   {
//     _id: "afdfdaffaa2a3",
//     title: "AG-K-0001 Kişisel Pet Küpe",
//     sku: "AG-K-0001",
//     price: 9,
//     image:
//       "https://www.angoragumus.com/dimg/urun/21081241792322922572910A2323.jpg",
//   },
//   {
//     _id: "afdfdaffaa2a39",
//     title: "AG-OK-0003 Kişiselleştirilmiş İsim Küpe- Çivili",
//     sku: "AG-OK-0003",
//     price: 9,
//     image:
//       "https://www.angoragumus.com/dimg/urun/25062210652698927050New%20Project%20-%202021-01-23T150218.051.jpg",
//   },
//   {
//     _id: "afdfdaffaa2a39",
//     title: "AG-KB-003 Kişiselleştirilmiş İsim Bileklik - Figaro Zincir",
//     sku: "AG-KB-003",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/30295221572498727944RAW%20(30503%20of%201)_600x600.jpg",
//   },
//   {
//     _id: "afdfdaf2faa2wa39",
//     title: "AG-KB-007 Koordinat Bileklik",
//     sku: "AG-KB-007",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/28229251743006821097New%20Project%20(77).jpg",
//   },
//   {
//     _id: "afdfdaf2faa2wa39",
//     title: "AG-KB-006 Harf & Kalp Bileklik",
//     sku: "AG-KB-006",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/30182263402210823305New%20Project%20-%202021-01-23T024013.412.jpg",
//   },
//   {
//     _id: "afdfdaf2faa2wa319",
//     title: "AG-KB-002 Düğüm Bileklik Semboller",
//     sku: "AG-KB-002",
//     price: 16,
//     image:
//       "https://www.angoragumus.com/dimg/urun/28495233222390425148DSC01395.jpg",
//   },

//   {
//     _id: "afdfdaf2faa2w2a339",
//     title: "AG-HH-002 Toplu Halhal - Üçlü Zincir",
//     sku: "AG-HH-002",
//     price: 16,
//     image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
//   },
//   {
//     _id: "afdfdaf2faa2w2a3w9",
//     title: "AG-OK-0004 Çengelli Doğum Taşlı Damla Küpe",
//     sku: "AG-OK-0004",
//     price: 9,
//     image:
//       "https://www.angoragumus.com/dimg/urun/27800265102858630548POC_7805-1.jpg",
//   },
//   {
//     _id: "afdfdaf2faa2w2a3w229",
//     title: "AG-DTK020 Doğum Taşlı Sallantılı Küpe",
//     sku: "AG-DTK020",
//     price: 9,
//     image:
//       "https://www.angoragumus.com/dimg/urun/28907243552818420936POC_2855-1.jpg",
//   },
//   {
//     _id: "afdfdaf2faa2w2a3w22229",
//     title: "AG-DTK016 Damla Doğum Taşlı Küpe",
//     sku: "AG-DTK016",
//     price: 10,
//     image:
//       "https://www.angoragumus.com/dimg/urun/22317224402784624366POC_2721-1.jpg",
//   },
//   {
//     _id: "afdfdaf2faa2w2a3w2222229",
//     title: "AAG-DTK012 Doğum Taşlı Balık Kancalı Damla Küpe",
//     sku: "AG-DTK012",
//     price: 10,
//     image:
//       "https://www.angoragumus.com/dimg/urun/28474267062225231821POC_2733-1.jpg",
//   },
// ];

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
