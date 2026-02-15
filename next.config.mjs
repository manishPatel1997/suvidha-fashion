/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard',
        permanent: true,
      },
    ];
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': './src',
    };
    return config;
  },
  turbopack: {
    resolveAlias: {
      '@': './src',
    },
  },
  images: {
    qualities: [75, 90],
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3008",
        pathname: "/upload/**",
      },
    ],
  },
};

export default nextConfig;
