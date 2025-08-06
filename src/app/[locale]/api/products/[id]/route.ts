import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Product from "@/models/Product";
import { ProductVariantModel } from "@/models/ProductVariant";

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const product = await Product.findById(params.id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;
    const body = await req.json();
    const {
      parentSku,
      title,
      price,
      description,
      weight,
      dimensions,
      images,
      attributes,
      category,
      estimatedProductionTime,
      variants,
    } = body;

    // Update the main product
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        parentSku,
        title,
        price,
        description,
        weight,
        dimensions,
        images,
        attributes,
        category,
        estimatedProductionTime,
      },
      { new: true },
    );

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update variants - first delete existing variants, then create new ones
    if (variants && variants.length > 0) {
      await ProductVariantModel.deleteMany({ productId });

      const variantPromises = variants.map(
        (variant: {
          _id?: string;
          childSku: string;
          price: number;
          attributes: { name: string; value: string }[];
          stock?: number;
        }) => {
          const productVariant = new ProductVariantModel({
            productId: updatedProduct._id,
            childSku: variant.childSku,
            price: variant.price,
            attributes: variant.attributes,
            stock: variant.stock || 0,
          });

          return productVariant.save();
        },
      );

      await Promise.all(variantPromises);
    }

    return NextResponse.json({
      success: true,
      product: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);

    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const productId = params.id;

    // First, delete all product variants associated with this product
    await ProductVariantModel.deleteMany({ productId });

    // Then delete the main product
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product and its variants deleted successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting product:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
