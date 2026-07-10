const userAgent = process.env.npm_config_user_agent ?? '';

if (!userAgent.startsWith('pnpm/')) {
  console.error('This repository uses pnpm. Run `corepack pnpm install` instead of npm install.');
  process.exit(1);
}
