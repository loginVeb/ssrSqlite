import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  // Добавляем манифест с URL
  manifest: {
    start_url: "https://ssr-gamma-seven.vercel.app/",
  },
});

export default withPWA({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups.commons = {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendor',
        chunks: 'all',
      };
    }
    return config;
  },
  images: {
    domains: ['ssr-gamma-seven.vercel.app'],
  },
  // Удален блок routes
});
