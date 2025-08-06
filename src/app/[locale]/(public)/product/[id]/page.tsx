import {
  DisclosureButton,
  Disclosure,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  DisclosurePanel,
} from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import mongoose from "mongoose";
import Image from "next/image";
import { getServerSession } from "next-auth";

import AddToCartButton from "@/components/product-details/addToCartButton";
import AddToFavoritesButton from "@/components/product-details/addToFavoritesButton";
import AttributeSelect from "@/components/product-details/AttributeSelect";
import { authOptions } from "@/lib/auth";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

const details = [
  {
    name: "Özellikler",
    items: [
      "Zincir ebatı: Kolye zincir boyu 40+5 uyarlanabilir. ( İstege göre ebat ve modeli değişebilir) Bileklik ebatları bileğie göre ayarlanabilir asansörlü ya da uzatmalı modeldir. Küpelerde zincirli modellerde zincir ebatı modele göre değişkendir. ",
      "Renk: Gümüş, Roze ve Gold",
      "Kaplama: Cila üzeri Rodyum, Roze-gold ve 14 ayar altın  kaplama ile kaplanmıştır. ",
      "Ağırlık: Modeldeki değişikliklere göre ve zincir ebatına göre değişkenlik gösterebilir.",
      "Taş: Taş isimleri ürün başlığında belirtilmiştir.  Belitirmediğildi durumlarda zirkon kullanılmıştır. ",
    ],
  },
];

const ProductPage = async ({
  params: { id },
  searchParams,
}: {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  // Get product with first variant (minimum price)
  const productWithVariant = await Product.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $lookup: {
        from: "product_variants",
        localField: "_id",
        foreignField: "productId",
        as: "variants",
      },
    },
    {
      $addFields: {
        firstProductVariant: {
          $ifNull: [
            {
              $arrayElemAt: [
                {
                  $sortArray: {
                    input: "$variants",
                    sortBy: { price: 1 },
                  },
                },
                0,
              ],
            },
            null,
          ],
        },
      },
    },
    {
      $project: {
        variants: 0,
      },
    },
  ]);

  const product = productWithVariant[0];

  const session = await getServerSession(authOptions);

  if (!product) {
    throw new Error("Product not found");
  }

  // Get initial variant if search params exist
  let initialVariant = null;
  if (Object.keys(searchParams).length > 0) {
    // Build the query conditions for each attribute
    const attributeConditions = Object.entries(searchParams).map(
      ([name, value]) => ({
        attributes: {
          $elemMatch: {
            name: name,
            value: Array.isArray(value) ? value[0] : value,
          },
        },
      }),
    );

    initialVariant = await ProductVariantModel.findOne({
      productId: id,
      $and: attributeConditions,
    }).lean();
  }

  const productData = JSON.parse(JSON.stringify(product));

  const variantData = initialVariant
    ? JSON.parse(JSON.stringify(initialVariant))
    : productData.firstProductVariant
      ? JSON.parse(JSON.stringify(productData.firstProductVariant))
      : null;

  return (
    <div className="bg-white w-full mt-8 lg:mt-12">
      <div className="mx-auto px-4 py-8 md:px-0 sm:py-12 lg:max-w-6xl w-full">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <TabGroup className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <TabList className="grid grid-cols-4 gap-6">
                {productData.images.map((image: string) => (
                  <Tab
                    key={image}
                    className="group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-500/50 focus:ring-offset-4"
                  >
                    <span className="sr-only">{image}</span>
                    <span className="absolute inset-0 overflow-hidden rounded-md">
                      <Image
                        width={400}
                        height={400}
                        alt=""
                        src={image}
                        className="size-full object-cover"
                      />
                    </span>
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-md ring-2 ring-transparent ring-offset-2 group-data-[selected]:ring-indigo-500"
                    />
                  </Tab>
                ))}
              </TabList>
            </div>

            <TabPanels>
              {productData.images.map((image: string) => (
                <TabPanel key={`${image}-${id}`}>
                  <Image
                    width={400}
                    height={400}
                    alt={image}
                    src={image}
                    className="aspect-square w-full object-cover rounded-lg"
                  />
                </TabPanel>
              ))}
            </TabPanels>
          </TabGroup>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {productData.title}
            </h1>
            <h2>SKU: {variantData.childSku}</h2>
            <p className="text-lg text-black mt-2">
              Fiyat: ${variantData.price}
            </p>
            <p className="text-lg text-black mt-2">Stok: {variantData.stock}</p>
            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                dangerouslySetInnerHTML={{ __html: productData.description }}
                className="space-y-6 text-base text-gray-700"
              />
            </div>
            <AttributeSelect
              productData={productData}
              initialVariant={variantData}
              productId={id}
            />
            <div className="mt-10 flex items-center space-x-4">
              <AddToCartButton productId={variantData._id} />
              {session && <AddToFavoritesButton productId={productData._id} />}
            </div>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                {details.map((detail: { name: string; items: string[] }) => (
                  <Disclosure key={detail.name} as="div">
                    <h3>
                      <DisclosureButton className="group relative flex w-full items-center justify-between py-6 text-left">
                        <span className="text-sm font-medium text-gray-900 group-data-[open]:text-indigo-600">
                          {detail.name}
                        </span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon
                            aria-hidden="true"
                            className="block size-6 text-gray-400 group-hover:text-gray-500 group-data-[open]:hidden"
                          />
                          <MinusIcon
                            aria-hidden="true"
                            className="hidden size-6 text-indigo-400 group-hover:text-indigo-500 group-data-[open]:block"
                          />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pb-6">
                      <ul
                        role="list"
                        className="list-disc space-y-1 pl-5 text-sm/6 text-gray-700 marker:text-gray-300"
                      >
                        {detail.items.map((item) => (
                          <li key={item} className="pl-2">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
