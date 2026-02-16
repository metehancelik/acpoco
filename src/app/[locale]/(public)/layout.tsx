import "@/app/globals.css";

// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Nunito_Sans, Rubik } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

import BackToTop from "@/components/layout/BackToTop";
import Footer from "@/components/layout/Footer";
import PublicNavbar from "@/components/layout/PublicNavbar";
import { Providers } from "@/components/Providers";
import { TanstackProvider } from "@/components/tanstack/tanstack-provider";
import { routing } from "@/i18n/routing";

const geistSans = localFont({
	src: "../../fonts/GeistVF.woff",
	variable: "--font-geist-sans",
	weight: "100 900",
});
const geistMono = localFont({
	src: "../../fonts/GeistMonoVF.woff",
	variable: "--font-geist-mono",
	weight: "100 900",
});

const rubik = Rubik({
	subsets: ["latin"],
	variable: "--font-rubik",
	display: "swap",
});
const nunitoSans = Nunito_Sans({
	subsets: ["latin"],
	variable: "--font-nunito-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_APP_NAME,
	description: process.env.NEXT_PUBLIC_APP_DESCRIPTION,
};

// const queryClient = new QueryClient();
export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<{
	children: React.ReactNode;
	params: { locale: "en" | "tr" | "de" };
}>) {
	setRequestLocale(locale);

	if (!routing.locales.includes(locale)) {
		notFound();
	}
	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html lang={locale}>
			<Providers>
				<body
					className={`${geistSans.variable} ${geistMono.variable} ${rubik.variable} ${nunitoSans.variable} antialiased font-[var(--font-geist-sans),ui-sans-serif,system-ui,sans-serif]`}
				>
					<NextIntlClientProvider messages={messages}>
						<TanstackProvider>
							{/* Single continuous background: navbar and content on same surface */}
							<div className="relative min-h-screen flex flex-col">
								{/* Full-bleed gradient + orbs — one surface from top to bottom */}
								<div
									className="fixed inset-0 -z-10 bg-linear-to-br from-stone-50 via-stone-50/98 to-amber-50/50"
									aria-hidden
								/>
								<div
									className="fixed top-0 right-0 h-[480px] w-[480px] -translate-y-1/4 translate-x-1/3 rounded-full bg-amber-100/30 blur-3xl -z-10 pointer-events-none"
									aria-hidden
								/>
								<div
									className="fixed bottom-0 left-0 h-[360px] w-[360px] -translate-x-1/3 translate-y-1/3 rounded-full bg-stone-200/35 blur-3xl -z-10 pointer-events-none"
									aria-hidden
								/>

								<div className="relative flex flex-col min-h-screen w-full max-w-[1600px] mx-auto px-3 sm:px-4 lg:px-5 xl:px-6">
									<PublicNavbar />
									<main className="flex flex-1 flex-col pb-8 pt-3 sm:pt-4 lg:pt-5">
										{children}
									</main>
									<Footer />
									<BackToTop />
								</div>
							</div>
						</TanstackProvider>
					</NextIntlClientProvider>
				</body>
			</Providers>
		</html>
	);
}
