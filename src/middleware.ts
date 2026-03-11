import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import logger from "@/lib/logger";

import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
	const start = Date.now();
	const path = req.nextUrl.pathname;
	const skip =
		path.startsWith("/_next") || path === "/favicon.ico" || /\.\w+$/.test(path);

	const res = intlMiddleware(req);

	if (!skip) {
		logger.info({
			type: "http",
			method: req.method,
			path,
			status: res.status,
			duration_ms: Date.now() - start,
		});
	}

	return res;
}

export const config = {
	matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
