/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
	output: "standalone",
	images: {
		loader: "custom",
		loaderFile: "./imageLoader.mjs",
		remotePatterns: [
			{
				protocol: "https",
				hostname: "sage-demo.vercel.app",
			},
			{
				protocol: "https",
				hostname: "cdn.shopify.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.etsystatic.com",
			},
			{
				protocol: "https",
				hostname: "tailwindui.com",
			},
			{
				protocol: "https",
				hostname: "www.angoragumus.com",
			},
			{
				protocol: "https",
				hostname: "i.ibb.co",
			},
			{
				protocol: "https",
				hostname: "m.media-amazon.com",
			},
			{
				protocol: "https",
				hostname: "drive.google.com",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com",
			},
			{
				protocol: "https",
				hostname: "shop.acpoco.de",
			},
			{
				protocol: "https",
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
