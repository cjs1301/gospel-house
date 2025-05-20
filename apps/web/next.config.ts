import type { NextConfig } from "next";

import withSerwistInit from "@serwist/next";

const revision = crypto.randomUUID();

const withSerwist = withSerwistInit({
    cacheOnNavigation: true,
    swSrc: "src/app/sw.ts",
    swDest: "public/sw.js",
    additionalPrecacheEntries: [{ url: "/~offline", revision }],
    disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
    /* config options here */
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                hostname: "images.unsplash.com",
            },
            {
                hostname: "gospel-house-archive.s3.ap-northeast-2.amazonaws.com",
            },
        ],
    },
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "strict-origin-when-cross-origin",
                    },
                ],
            },
            {
                source: "/sw.js",
                headers: [
                    {
                        key: "Content-Type",
                        value: "application/javascript; charset=utf-8",
                    },
                    {
                        key: "Cache-Control",
                        value: "public, max-age=0, must-revalidate",
                    },
                    {
                        key: "Service-Worker-Allowed",
                        value: "/",
                    },
                ],
            },
        ];
    },
    webpack: (config) => {
        config.resolve.alias.canvas = false;
        config.resolve.alias.encoding = false;
        return config;
    },
};

export default withSerwist(nextConfig);

// export default nextConfig;
