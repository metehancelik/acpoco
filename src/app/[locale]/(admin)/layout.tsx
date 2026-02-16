import type { Metadata } from "next";
import "@/app/globals.css";

import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { ToastContainer } from "react-toastify";

import BackToTop from "@/components/layout/BackToTop";
import Sidebar from "@/components/layout/Sidebar";
import { routing } from "@/i18n/routing";
import "react-datepicker/dist/react-datepicker.css";

import "react-toastify/dist/ReactToastify.css";

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

export const metadata: Metadata = {
	title: "acpocob2b.com",
	description: "Acpoco B2B",
};

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

	const messages = await getMessages();

	return (
		<html lang={locale}>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen lg:h-screen lg:overflow-hidden`}
			>
				<NextIntlClientProvider messages={messages}>
					<ToastContainer />
					<Sidebar />
					{/* Fixed-height area below navbar (lg); scroll lives inside children (products column only) */}
					<div
						id="content-scroll"
						className="flex min-h-0 flex-1 flex-col overflow-y-auto pt-4 pb-6 px-2 sm:px-6 lg:mt-20 lg:h-[calc(100vh-5rem)] lg:px-0 lg:pt-0 lg:pb-0"
					>
						{children}
					</div>
					<BackToTop />
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
