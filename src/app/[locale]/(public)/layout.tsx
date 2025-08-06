import "@/app/globals.css";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";

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

export const metadata: Metadata = {
  title: "angoragumuspartner.com",
  description: "Angora Gümüş Partner",
};

// const queryClient = new QueryClient();
export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: "en" | "tr" };
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
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            <TanstackProvider>
              <PublicNavbar />
              <main className="py-4 lg:py-24">{children}</main>
              <Footer />
            </TanstackProvider>
          </NextIntlClientProvider>
        </body>
      </Providers>
    </html>
  );
}
