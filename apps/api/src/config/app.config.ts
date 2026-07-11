import { registerAs } from "@nestjs/config";

export const AppConfig = registerAs("env", () => ({
  NODE_ENV: process.env.NODE_ENV ?? "development",
  API_PORT: Number(process.env.API_PORT ?? 3001),
  API_GLOBAL_PREFIX: process.env.API_GLOBAL_PREFIX ?? "api/v1",
  WEB_ORIGIN: process.env.WEB_ORIGIN ?? "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_API_KEY: process.env.AUTH_API_KEY,
  SALT_ROUNDS: Number(process.env.SALT_ROUNDS ?? 10),
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION ?? "15m",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION ?? "7d",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_RESET_PASSWORD_SECRET: process.env.JWT_RESET_PASSWORD_SECRET,
  JWT_ISSUER: process.env.JWT_ISSUER ?? "NexusCRM",
  JWT_AUDIENCE: process.env.JWT_AUDIENCE ?? "NexusCRMUsers",
  COOKIE_NAME: process.env.COOKIE_NAME ?? "nexuscrm_session",
  COOKIE_SECURE: process.env.COOKIE_SECURE === "true",
  SEED_FAKER_SEED: Number(process.env.SEED_FAKER_SEED ?? 20260709),
  ALLOW_DB_RESET: process.env.ALLOW_DB_RESET === "true",
}));

export default AppConfig;
