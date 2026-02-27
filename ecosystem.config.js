module.exports = {
  apps: [
    {
      name: 'flash-arb-bot',
      script: 'scripts/bot.js',
      args: '--network bsc',
      env: {
        NODE_ENV: 'production',
        // make sure your .env contains PRIVATE_KEY, RPC_URL, etc.
      },
      // restart on failure
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
    },
  ],
};
