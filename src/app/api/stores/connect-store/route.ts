import { type NextRequest, NextResponse } from "next/server";

import { Store, User } from "@/models";

export async function POST(request: NextRequest) {
	const { shopId, userId } = await request.json();

	const store = await Store.findById(shopId);
	const user = await User.findById(userId);

	if (!user) {
		return NextResponse.json({ message: "User not found" }, { status: 404 });
	}
	if (!store) {
		return NextResponse.json({ message: "Store not found" }, { status: 404 });
	}
	if (store.userId) {
		const oldUser = await User.findById(store.userId);
		if (oldUser) {
			oldUser.stores = oldUser.stores.filter(
				(st: unknown) => st?.toString() !== store._id?.toString(),
			);
			await oldUser.save();
		}
	}
	if (user.stores.includes(store._id)) {
		return NextResponse.json(
			{ message: "Store already connected" },
			{ status: 400 },
		);
	}

	user.stores.push(store._id);
	await user.save();
	if (!store) {
		return NextResponse.json({ message: "Store not found" }, { status: 404 });
	}

	store.userId = userId;
	await store?.save();

	return NextResponse.json({ message: "Store connected" });
}
