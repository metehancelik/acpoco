/**
 * Custom Next.js image loader.
 * These domains are returned as-is so the browser loads them directly
 * (avoids "upstream response is invalid" when Next.js server fetches are blocked).
 */
const DIRECT_LOAD_DOMAINS = [
	"cdn.shopify.com",
	"shop.acpoco.de",
	"drive.google.com",
	"lh3.googleusercontent.com",
];

export default function imageLoader({ src, width, quality }) {
	if (
		typeof src === "string" &&
		DIRECT_LOAD_DOMAINS.some((d) => src.includes(d))
	) {
		return src;
	}
	return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality ?? 75}`;
}
