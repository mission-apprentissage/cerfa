function inline(value) {
  return value.replace(/\s{2,}/g, " ").trim();
}

const contentSecurityPolicy = `
      default-src 'self' https://plausible.io;
      frame-src 'self';
      base-uri 'self';
      block-all-mixed-content;
      font-src 'self' https: data:;
      frame-ancestors 'self';
      img-src 'self' https://www.notion.so data: https://www.ssa.gov;
      object-src 'none';
      script-src 'self'  https://plausible.io ${
        process.env.NEXT_PUBLIC_ENV === "dev" ? "'unsafe-eval'" : ""
      } https://www.ssa.gov https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js;
      script-src-attr 'none';
      style-src 'self' https: 'unsafe-inline';
      upgrade-insecure-requests;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/auth/connexion",
        destination: "/",
        permanent: true,
      },
    ];
  },
  reactStrictMode: true,
  experimental: {
    outputStandalone: true,
  },
  webpack: (config) => {
    // load worker files as a urls by using Asset Modules
    // https://webpack.js.org/guides/asset-modules/
    config.module.rules.unshift({
      test: /pdf\.worker\.(min\.)?js/,
      type: "asset/resource",
      generator: {
        filename: "static/worker/[hash][ext][query]",
      },
    });

    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: inline(contentSecurityPolicy),
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
