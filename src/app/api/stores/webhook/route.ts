import { type NextRequest, NextResponse } from "next/server";

import { fetchNewOrders } from "@/lib/shipstation/client";
import { LogModel } from "@/models/Logs";

export const POST = async (req: NextRequest) => {
	try {
		const data = await req.json();
		const newLog = new LogModel({
			message: "API /stores/webhook called",
			level: "info",
			meta: data,
		});
		await newLog.save();
		await fetchNewOrders(data.resource_url);
	} catch (error) {
		const newLog = new LogModel({
			message: "API /stores/webhook called",
			level: "error",
			meta: { error },
		});
		await newLog.save();
	}

	return NextResponse.json({ message: "Webhook received" });
};
