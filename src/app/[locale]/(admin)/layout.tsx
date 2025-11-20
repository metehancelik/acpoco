import type { Metadata } from "next";
import "@/app/globals.css";

import localFont from "next/font/local";
import { ToastContainer } from "react-toastify";

import Sidebar from "@/components/layout/Sidebar";
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

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<ToastContainer />
				<Sidebar />
				<main className="py-24">
					<div className="px-4 sm:px-6">{children}</div>
				</main>
			</body>
		</html>
	);
}
