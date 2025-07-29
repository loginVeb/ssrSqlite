import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  workboxOptions: {
    mode: 'production',
  },
  // Удален манифест с URL для локальной разработки
  manifest: {
  },
});

export default withPWA({
  webpack: (config, { isServer }) => {
    if (!isServer) {
      if (!config.optimization) {
        config.optimization = {};
      }
      if (!config.optimization.splitChunks) {
        config.optimization.splitChunks = {};
      }
      if (!config.optimization.splitChunks.cacheGroups) {
        config.optimization.splitChunks.cacheGroups = {};
      }
      config.optimization.splitChunks.cacheGroups.commons = {
        test: /[\\/]node_modules[\\/]/,
        // name: 'vendor',
        // chunks: 'all',
      };
    }
    return config;
  },
  images: {
    domains: [],
  },
  // Удален блок routes
});
