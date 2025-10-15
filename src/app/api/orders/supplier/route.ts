import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import Order from "@/models/Order";
import Store from "@/models/Store";

interface OrderQuery {
  "advancedOptions.storeId"?: { $in: number[] };
  "billTo.name"?: { $regex: string; $options: string };
  createDate?: { $gte?: Date; $lte?: Date };
  status?: string | { $ne: string };
  $or?: {
    sku?: { $regex: string; $options: string };
    productName?: { $regex: string; $options: string };
    "billTo.name"?: { $regex: string; $options: string };
  }[];
  shopName?: { $regex: string; $options: string };
  sku?: { $regex: string; $options: string };
  warehouse?: { $regex: string; $options: string };
  isPayed?: boolean;
}

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderIds, changedStatus, isAllSelected } = await request.json();

  const { searchParams } = new URL(request.url);
  const storeId = searchParams.get("storeId");
  const customerName = searchParams.get("customerName");
  const orderDateStart = searchParams.get("orderDateStart");
  const orderDateEnd = searchParams.get("orderDateEnd");
  const status = searchParams.get("status");

  const searchTerm = searchParams.get("searchTerm");
  const shopName = searchParams.get("shopName");
  const sku = searchParams.get("sku");
  const warehouse = searchParams.get("warehouse");
  try {
    const stores = await Store.find({ userId: session.user.id });
    const storeIds = stores.map((store) => store.storeId);
    const query: OrderQuery = {
      "advancedOptions.storeId": { $in: storeId ? [+storeId] : storeIds },
    };
    if (customerName) {
      query["billTo.name"] = { $regex: customerName, $options: "i" };
    }

    if (searchTerm) {
      query.$or = [
        { sku: { $regex: searchTerm, $options: "i" } },
        { productName: { $regex: searchTerm, $options: "i" } },
        { "billTo.name": { $regex: searchTerm, $options: "i" } },
      ];
    }

    if (status) {
      query.status = status;
    } else if (session.user.role === "ADMIN" && !status) {
      query.status = { $ne: "waitingPayment" };
    }

    if (shopName) {
      query["shopName"] = { $regex: shopName, $options: "i" };
    }

    if (sku) {
      query.sku = { $regex: sku, $options: "i" };
    }

    if (warehouse) {
      query.warehouse = { $regex: warehouse, $options: "i" };
    }

    if (orderDateStart || orderDateEnd) {
      query.createDate = {
        ...(orderDateStart && { $gte: new Date(orderDateStart) }),
        ...(orderDateEnd && { $lte: new Date(orderDateEnd) }),
      };
    }

    if (isAllSelected) {
      await Order.updateMany(query, { $set: { status: changedStatus } });

      return NextResponse.json(
        { message: "Siparişler güncellendi" },
        { status: 200 },
      );
    } else {
      await Order.updateMany(
        { _id: { $in: orderIds } },
        { $set: { status: changedStatus } },
      );

      return NextResponse.json(
        { message: "Siparişler güncellendi" },
        { status: 200 },
      );
    }
  } catch (error) {
    throw new Error(error as string);
  }
}
