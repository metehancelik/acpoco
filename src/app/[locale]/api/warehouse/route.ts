import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Warehouse from "@/models/Warehouse";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const warehouses = await Warehouse.find();

    return NextResponse.json(warehouses);
  } catch (error) {
    console.error("Error fetching warehouses:", error);

    return NextResponse.json(
      { error: "Failed to fetch warehouses" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { country, countryCode, price } = await request.json();

  try {
    const newWarehouse = await Warehouse.create({
      country,
      countryCode,
      price,
    });

    return NextResponse.json(newWarehouse);
  } catch (error) {
    console.error("Error creating warehouse:", error);

    return NextResponse.json(
      { error: "Failed to create warehouse" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, country, countryCode, price } = await request.json();

  try {
    const updatedWarehouse = await Warehouse.findByIdAndUpdate(id, {
      country,
      countryCode,
      price,
    });

    return NextResponse.json(updatedWarehouse);
  } catch (error) {
    console.error("Error updating warehouse:", error);

    return NextResponse.json(
      { error: "Failed to update warehouse" },
      { status: 500 },
    );
  }
}
