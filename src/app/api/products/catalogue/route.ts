import { NextResponse } from "next/server";

import Product from "@/models/Product";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const query = searchParams.get("query") || undefined;
  const page = searchParams.get("page") || 1;

  // Build filter object conditionally
  const filter: Record<
    string,
    { $regex?: string; $options?: string } | string
  > = {};
  if (category) filter.category = category;
  if (query) filter.title = { $regex: query, $options: "i" };

  const products = await Product.find(filter)
    .skip((Number(page) - 1) * 20)
    .limit(20);

  const totalProducts = await Product.countDocuments(filter);
  const pageCount = Math.ceil(totalProducts / 20);

  return NextResponse.json({ products, pageCount });
}
