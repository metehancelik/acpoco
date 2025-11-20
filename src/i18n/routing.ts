import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	// A list of all locales that are supported
	locales: ["en", "tr"],
	// Used when no locale matches
	defaultLocale: "tr",
	// pathnames: {
	//   "/": "/",
	//   "/blog": "/blog",
	//   "/login": "/login",
	//   "/dashboard": "/dashboard",
	//   "/sales": "/sales",
	//   "/all-products": {
	//     en: "/all-products",
	//     tr: "/tum-urunler",
	//   },
	//   "/demo": "/demo",
	//   "/product/[id]": "/product/[id]",
	//   "/users/[id]": "/users/[id]",
	//   "/wallets": "/wallets",
	// },
});

// export type Pathnames = keyof typeof routing.pathnames;
// export type Pathnames =
//   | keyof typeof routing.pathnames
//   | `/product/${string}`
//   | `/users/${string}`;
export type Locale = (typeof routing.locales)[number];

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, getPathname, redirect, usePathname, useRouter } =
	createNavigation(routing);
