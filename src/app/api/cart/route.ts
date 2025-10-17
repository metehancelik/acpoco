import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ProductVariantModel } from "@/models/ProductVariant";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productVariantId, quantity } = await req.json();

    if (!productVariantId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email: session.user?.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if product is already in CART
    if (
      user.cart.some(
        (item: { _id: string }) => item._id.toString() === productVariantId,
      )
    ) {
      const cartItem = user.cart.find(
        (item: { _id: string }) => item._id.toString() === productVariantId,
      );
      cartItem.count += quantity || 1;
      await user.save();

      return NextResponse.json(
        { message: "Product quantity updated in cart" },
        { status: 200 },
      );
    }

    // Add product to CART
    // Check if product exists before adding to cart
    const product = await ProductVariantModel.findById(productVariantId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    user.cart.push({ _id: productVariantId, count: quantity || 1 });
    await user.save();

    return NextResponse.json(
      { message: "Product added to cart" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error adding cart:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const productVariantIds = user.cart.map((item: { _id: string }) => item._id);

  const tempCart = await ProductVariantModel.find({
    _id: { $in: productVariantIds },
  }).populate("productId", "images title");

  const discountPercent = user?.discountPercent || 0;
  const cart = tempCart.map((item) => {
    const count = user.cart.find(
      (cartItem: { _id: string }) =>
        cartItem._id.toString() === item._id.toString(),
    )?.count;
    const basePrice = item.price;
    const discounted =
      basePrice * (1 - Math.min(100, Math.max(0, discountPercent)) / 100);

    return {
      ...item.toObject(),
      price: Math.max(0, Number(discounted.toFixed(2))),
      originalPrice: basePrice,
      discountPercent,
      count,
    };
  });

  return NextResponse.json({ cart }, { status: 200 });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productVariantId } = await req.json();

  if (!productVariantId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  user.cart = user.cart.filter(
    (item: { _id: string }) => item._id.toString() !== productVariantId,
  );
  await user.save();

  return NextResponse.json(
    { message: "Product removed from cart" },
    { status: 200 },
  );
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { productVariantId, quantity } = await req.json();

  if (!productVariantId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 },
    );
  }

  const user = await User.findOne({ email: session.user?.email });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const product = await ProductVariantModel.findById(productVariantId);

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const cartItem = user.cart.find(
    (item: { _id: string }) => item._id.toString() === productVariantId,
  );

  if (!cartItem) {
    return NextResponse.json(
      { error: "Product not found in cart" },
      { status: 404 },
    );
  }

  cartItem.count = quantity;
  if (quantity <= 0) {
    user.cart = user.cart.filter(
      (item: { _id: string }) => item._id.toString() !== productVariantId,
    );
  }
  await user.save();

  return NextResponse.json({ message: "Cart updated" }, { status: 200 });
}
