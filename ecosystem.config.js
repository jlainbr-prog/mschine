module.exports = {
  apps: [
    {
      name: 'flash-arb-bot',
      script: 'scripts/multi-flash-arbbot.js',
      env: {
        NODE_ENV: 'production',
        CYCLE_INTERVAL_HOURS: '6',      // ciclos a cada 6 horas
        MIN_PROFIT_USD: '30',
        SLIPPAGE: '50',
        GAS_MULTIPLIER: '1.2'
        // PRIVATE_KEY, RPC_ETH, RPC_BSC devem estar no .env
      },
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 5000,
      error_file: 'logs/flash-arb-error.log',
      out_file: 'logs/flash-arb-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    },
  ],
};
