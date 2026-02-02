/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				hostname: "sage-demo.vercel.app",
			},
			{
				hostname: "cdn.shopify.com",
			},
			{
				hostname: "i.etsystatic.com",
			},
			{
				hostname: "tailwindui.com",
			},
			{
				hostname: "www.angoragumus.com",
			},
			{
				hostname: "i.ibb.co",
			},
			{
				hostname: "m.media-amazon.com",
			},
			{
				hostname: "drive.google.com",
			},
			{
				hostname: "lh3.googleusercontent.com",
			},
			{
				hostname: "shop.acpoco.de",
			},
			{
				hostname: "i.ebayimg.com",
			},
		],
	},
	transpilePackages: ["swagger-ui-react"],
	experimental: {
		instrumentationHook: true,
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
};

export default withNextIntl(nextConfig);
