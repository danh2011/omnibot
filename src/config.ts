
import 'dotenv/config';

export const CONFIG = {
  token: process.env.DISCORD_TOKEN ?? '',
  clientId: process.env.DISCORD_CLIENT_ID ?? '',
  databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db',
  // Feature flags for future beta program
  betaFeatures: {
    advancedAutomod: false,
    aiChat: false
  }
};

if (!CONFIG.token) {
  console.warn('[WARN] DISCORD_TOKEN is not set.');
}
if (!CONFIG.clientId) {
  console.warn('[WARN] DISCORD_CLIENT_ID is not set.');
}
