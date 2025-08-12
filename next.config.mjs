/** @type {import('next').NextConfig} */
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
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
        hostname: `${process.env.S3_BUCKET_NAME}.s3.${process.env.S3_REGION}.amazonaws.com`,
      },
      {
        hostname: "i.ibb.co",
      },
      {
        hostname: "m.media-amazon.com",
      },
    ],
  },
  transpilePackages: ["swagger-ui-react"],
  experimental: {
    instrumentationHook: true,
  },
};

export default withNextIntl(nextConfig);
