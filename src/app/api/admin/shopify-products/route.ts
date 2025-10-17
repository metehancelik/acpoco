import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { shopifyClient, GET_PRODUCTS_QUERY } from "@/lib/shopify";
import { CategoryModel } from "@/models/Category";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

// Shopify GraphQL response types
interface ShopifyImage {
  id: string;
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

interface ShopifySelectedOption {
  name: string;
  value: string;
}

interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string;
  inventoryQuantity?: number;
  availableForSale: boolean;
  sku?: string;
  selectedOptions: ShopifySelectedOption[];
}

interface ShopifyOption {
  id: string;
  name: string;
  values: string[];
}

interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
}

interface ShopifyProduct {
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
  images: {
    edges: Array<{
      node: ShopifyImage;
    }>;
  };
  variants: {
    edges: Array<{
      node: ShopifyVariant;
    }>;
  };
  collections: {
    edges: Array<{
      node: ShopifyCollection;
    }>;
  };
  options: ShopifyOption[];
}

interface ShopifyProductsResponse {
  products: {
    edges: Array<{
      node: ShopifyProduct;
      cursor: string;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
      startCursor: string;
      endCursor: string;
    };
  };
}

interface Category {
  _id: string;
  name: string;
  image: string;
}

export async function GET() {
  try {
    // Admin kontrolü
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Database bağlantısı
    await dbConnect();

    // Default kategori oluştur veya getir
    let defaultCategory = await CategoryModel.findOne({
      name: "Uncategorized",
    });
    if (!defaultCategory) {
      defaultCategory = await CategoryModel.create({
        name: "Uncategorized",
        image: "",
      });
    }

    let allProducts: ShopifyProduct[] = [];
    let hasNextPage = true;
    let afterCursor: string | null = null;
    const batchSize = 50; // Shopify'ın izin verdiği maksimum

    // Tüm ürünleri batch batch çek
    // eslint-disable-next-line no-console
    console.log("Shopify'dan ürünler çekiliyor...");
    while (hasNextPage) {
      const variables: {
        first: number;
        after?: string;
      } = {
        first: batchSize,
      };

      if (afterCursor) {
        variables.after = afterCursor;
      }

      const response = await shopifyClient.request<ShopifyProductsResponse>(
        GET_PRODUCTS_QUERY,
        variables,
      );

      const products = response.products.edges.map((edge) => edge.node);
      allProducts = [...allProducts, ...products];

      hasNextPage = response.products.pageInfo.hasNextPage;
      afterCursor = response.products.pageInfo.endCursor;

      // eslint-disable-next-line no-console
      console.log(`${allProducts.length} ürün çekildi...`);
    }

    // eslint-disable-next-line no-console
    console.log(
      `Toplam ${allProducts.length} ürün çekildi. Database'e kaydediliyor...`,
    );

    // Kategorileri oluştur veya getir
    const categoryMap = new Map<string, Category>();
    categoryMap.set("Uncategorized", defaultCategory as Category);

    for (const product of allProducts) {
      if (product.collections?.edges?.length > 0) {
        const firstCollection = product.collections.edges[0].node;
        if (!categoryMap.has(firstCollection.title)) {
          let category = await CategoryModel.findOne({
            name: firstCollection.title,
          });
          if (!category) {
            category = await CategoryModel.create({
              name: firstCollection.title,
              image: "",
            });
          }
          categoryMap.set(firstCollection.title, category as Category);
        }
      }
    }

    let createdProductsCount = 0;
    let updatedProductsCount = 0;
    let createdVariantsCount = 0;
    let updatedVariantsCount = 0;

    // Her ürünü işle
    for (const shopifyProduct of allProducts) {
      try {
        // Kategori belirle
        let productCategory = defaultCategory;
        if (shopifyProduct.collections?.edges?.length > 0) {
          const firstCollection = shopifyProduct.collections.edges[0].node;
          productCategory =
            categoryMap.get(firstCollection.title) || defaultCategory;
        }

        // Resimleri çıkar
        const images =
          shopifyProduct.images?.edges?.map((edge) => edge.node.url) || [];

        // Attributes oluştur (options'dan)
        const attributes =
          shopifyProduct.options?.map((option) => ({
            name: option.name,
            values: option.values,
          })) || [];

        // Fiyatı belirle (ilk variant'ın fiyatı)
        const firstVariantPrice =
          shopifyProduct.variants?.edges?.[0]?.node?.price || "0";

        // Product oluştur veya güncelle
        const productData = {
          parentSku: shopifyProduct.handle, // Handle'ı SKU olarak kullan
          title: shopifyProduct.title,
          price: parseFloat(firstVariantPrice),
          description: shopifyProduct.description || "no description",
          weight: {
            value: 0,
            unit: "kg",
          },
          dimensions: {
            length: 0,
            width: 0,
            height: 0,
            unit: "cm",
          },
          images,
          attributes,
          category: productCategory._id,
        };

        const existingProduct = await Product.findOne({
          parentSku: shopifyProduct.handle,
        });
        let product;

        if (existingProduct) {
          product = await Product.findByIdAndUpdate(
            existingProduct._id,
            productData,
            { new: true },
          );
          updatedProductsCount++;
        } else {
          product = await Product.create(productData);
          createdProductsCount++;
        }

        // Variants oluştur veya güncelle
        if (shopifyProduct.variants?.edges) {
          for (const variantEdge of shopifyProduct.variants.edges) {
            const variant = variantEdge.node;

            // childSku oluştur - Shopify variant ID veya SKU kullan
            const childSku =
              variant.sku || variant.id.split("/").pop() || variant.id;

            // Variant attributes oluştur
            const variantAttributes =
              variant.selectedOptions?.map((option) => ({
                name: option.name,
                value: option.value,
              })) || [];

            const variantData = {
              productId: product._id,
              childSku,
              price: parseFloat(variant.price),
              attributes: variantAttributes,
              stock: variant.inventoryQuantity || 0,
            };

            const existingVariant = await ProductVariantModel.findOne({
              childSku,
            });

            if (existingVariant) {
              await ProductVariantModel.findByIdAndUpdate(
                existingVariant._id,
                variantData,
                { new: true },
              );
              updatedVariantsCount++;
            } else {
              await ProductVariantModel.create(variantData);
              createdVariantsCount++;
            }
          }
        }
      } catch (productError) {
        // eslint-disable-next-line no-console
        console.error(
          `Ürün işlenirken hata oluştu (${shopifyProduct.title}):`,
          productError,
        );
        // Bir üründe hata olsa bile devam et
      }
    }

    return NextResponse.json({
      success: true,
      message: "Shopify ürünleri başarıyla database'e kaydedildi",
      stats: {
        totalProducts: allProducts.length,
        createdProducts: createdProductsCount,
        updatedProducts: updatedProductsCount,
        createdVariants: createdVariantsCount,
        updatedVariants: updatedVariantsCount,
        totalVariants: createdVariantsCount + updatedVariantsCount,
      },
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Shopify ürünleri çekilirken hata oluştu:", error);

    return NextResponse.json(
      {
        error: "Shopify ürünleri çekilirken hata oluştu",
        details: error instanceof Error ? error.message : "Bilinmeyen hata",
      },
      { status: 500 },
    );
  }
}
