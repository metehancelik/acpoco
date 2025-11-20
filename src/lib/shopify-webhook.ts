import crypto from "node:crypto";

import type { NextRequest } from "next/server";

export type ShopifyWebhookParseResult<T> =
	| {
			ok: true;
			json: T;
			hmac: string;
			topic?: string | null;
			shopDomain?: string | null;
	  }
	| {
			ok: false;
			reason: string;
	  };

export async function verifyAndParseShopifyWebhook<T = unknown>(
	req: NextRequest,
): Promise<ShopifyWebhookParseResult<T>> {
	const secret = process.env.SHOPIFY_WEBHOOK_SECRET;
	if (!secret) {
		return { ok: false, reason: "Missing SHOPIFY_WEBHOOK_SECRET" };
	}

	const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
	if (!hmacHeader) {
		return { ok: false, reason: "Missing HMAC header" };
	}

	const rawBody = await req.arrayBuffer();
	const bodyBuffer = Buffer.from(rawBody);

	const computedHmac = crypto
		.createHmac("sha256", secret)
		.update(bodyBuffer)
		.digest("base64");

	const valid = crypto.timingSafeEqual(
		Buffer.from(computedHmac, "utf-8"),
		Buffer.from(hmacHeader, "utf-8"),
	);

	if (!valid) {
		return { ok: false, reason: "Invalid HMAC" };
	}

	const text = Buffer.from(rawBody).toString("utf-8");
	const json = JSON.parse(text) as T;
	const topic = req.headers.get("x-shopify-topic");
	const shopDomain = req.headers.get("x-shopify-shop-domain");

	return { ok: true, json, hmac: hmacHeader, topic, shopDomain };
}
