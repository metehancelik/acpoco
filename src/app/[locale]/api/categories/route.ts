import { NextResponse } from "next/server";

import { CategoryModel } from "@/models/Category";

const categories = [
  {
    name: "Kolye",
    image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
  },
  {
    name: "Bileklik",
    image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
  },
  {
    name: "Küpe",
    image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
  },
  {
    name: "Halhal",
    image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
  },
  {
    name: "Yüzük",
    image: "https://www.angoragumus.com/dimg/urun/216442080129778251816.jpg",
  },
];

export async function GET() {
  const categories = await CategoryModel.find({});

  return NextResponse.json(categories);
}

export async function POST() {
  try {
    await CategoryModel.insertMany(categories);

    return NextResponse.json({ message: "Categories created successfully" });
  } catch (error) {
    console.error("Error creating categories", error);

    return NextResponse.json(
      { error: "Error creating categories" },
      { status: 500 },
    );
  }
}
