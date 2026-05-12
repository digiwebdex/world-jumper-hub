module.exports = {
  apps: [
    {
      name: "worldjumper-api",
      cwd: "/var/www/worldjumper/server",
      script: "node_modules/tsx/dist/cli.mjs",
      args: "src/index.ts",
      env: {
        NODE_ENV: "production",
      },
      max_memory_restart: "400M",
      autorestart: true,
      time: true,
    },
  ],
};
