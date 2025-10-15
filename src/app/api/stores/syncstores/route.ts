import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/lib/auth";
import { getStores } from "@/lib/shipstation/client";
import Store, { IStore } from "@/models/Store";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = session.user.id;

    let stores = await getStores();

    stores = stores.map(
      (store) =>
        ({
          ...store,
          userId,
        }) as unknown as IStore,
    );

    const operations = stores.map((store) => ({
      updateOne: {
        filter: { storeId: store.storeId },
        update: { $set: { ...store, userId, modifyDate: new Date() } },
        upsert: true,
      },
    }));

    if (operations.length > 0) {
      await Store.bulkWrite(operations);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to fetch stores", error);

    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 },
    );
  }
}
