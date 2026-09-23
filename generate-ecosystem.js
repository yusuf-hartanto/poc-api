module.exports = {
  apps: [
    {
      name: 'api',
      script: './dist/apps/api/server.js',
      node_args: '-r dotenv/config',
      args: ['dotenv_config_path=./.env.stage.prod'],
    },
  ],
};

console.log('✅ ecosystem.config.js generated');
