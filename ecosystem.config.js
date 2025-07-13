module.exports = {
  apps: [
    {
      name: "pwaArcope",
      script: "npm",
      args: "start",
      watch: false,
      cwd: "/var/www/html",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
