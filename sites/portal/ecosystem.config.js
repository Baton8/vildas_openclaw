module.exports = {
  apps: [
    {
      name: 'botan-portal',
      script: 'node_modules/.bin/next',
      args: 'start -p 4126',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        WORKSPACE_PATH: '/Users/c3dev/.openclaw/workspace',
      },
      // クラッシュ時に自動再起動
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
  ],
};
