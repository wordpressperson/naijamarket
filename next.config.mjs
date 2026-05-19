/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "pino-pretty": false,
      "@react-native-async-storage/async-storage": false,
    };
    return config;
  },
  experimental: {
    outputFileTracingExcludes: {
      '*': [
        'node_modules/viem',
        'node_modules/wagmi',
        'node_modules/@rainbow-me/rainbowkit',
        'node_modules/framer-motion',
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
      ],
    },
  },
};

export default nextConfig;
