import dbConnect from "@/lib/db";
import { logError } from "@/lib/log-error";
import { logEvent } from "@/lib/log-event";

export async function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		try {
			await dbConnect();
			logEvent("mongodb.connected");
		} catch (error) {
			logError(new Error("mongodb.connection_error", { cause: error }));
		}
	}
}
