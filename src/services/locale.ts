"use server";

import { cookies } from "next/headers";

import { type Locale, routing } from "@/i18n/routing";

const COOKIE_NAME = "NEXT_LOCALE";

export async function setUserLocale(locale: string) {
	if (!routing.locales.includes(locale as Locale)) {
		throw new Error(`Invalid locale: ${locale}`);
	}

	cookies().set(COOKIE_NAME, locale, {
		path: "/",
		maxAge: 60 * 60 * 24 * 365, // 1 year
		sameSite: "lax",
		httpOnly: true,
	});
}
