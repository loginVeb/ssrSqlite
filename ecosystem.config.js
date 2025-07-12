module.exports = {
  apps: [
    {
      name: "pwaArcope",
      script: "npm",
      args: "start",
      watch: false,
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
