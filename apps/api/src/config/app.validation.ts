import { z } from "zod";

const booleanFromEnvironment = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

export const dataSourceValidationSchema = z
  .object({
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  })
  .passthrough();

export const appValidationSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    API_PORT: z.coerce.number().int().min(1).max(65_535).default(3001),
    API_GLOBAL_PREFIX: z.string().min(1).default("api/v1"),
    WEB_ORIGIN: z.url().default("http://localhost:3000"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    AUTH_API_KEY: z.string().min(32),
    SALT_ROUNDS: z.coerce.number().int().min(4).max(31).default(10),
    JWT_ACCESS_EXPIRATION: z.string().min(1).default("15m"),
    JWT_REFRESH_EXPIRATION: z.string().min(1).default("7d"),
    JWT_ACCESS_SECRET: z.string().min(32),
    JWT_REFRESH_SECRET: z.string().min(32),
    JWT_RESET_PASSWORD_SECRET: z.string().min(32),
    JWT_ISSUER: z.string().min(1).default("NexusCRM"),
    JWT_AUDIENCE: z.string().min(1).default("NexusCRMUsers"),
    COOKIE_NAME: z.string().min(1).default("nexuscrm_session"),
    COOKIE_SECURE: booleanFromEnvironment,
  })
  .passthrough()
  .superRefine((environment, context) => {
    if (environment.JWT_ACCESS_SECRET === environment.JWT_REFRESH_SECRET) {
      context.addIssue({
        code: "custom",
        path: ["JWT_REFRESH_SECRET"],
        message: "JWT_REFRESH_SECRET must be different from JWT_ACCESS_SECRET",
      });
    }
  });

export const seedValidationSchema = z
  .object({
    NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
    SEED_FAKER_SEED: z.coerce.number().int().nonnegative().default(20_260_709),
    ALLOW_DB_RESET: booleanFromEnvironment,
  })
  .passthrough();

type AppEnvironment = z.infer<typeof appValidationSchema>;
type DataSourceEnvironment = z.infer<typeof dataSourceValidationSchema>;
export type SeedEnvironment = z.infer<typeof seedValidationSchema>;

export function validateEnvironment(
  environment: Record<string, unknown>,
): AppEnvironment {
  return appValidationSchema.parse(environment);
}

export function validateDataSourceEnvironment(
  environment: Record<string, unknown>,
): DataSourceEnvironment {
  return dataSourceValidationSchema.parse(environment);
}

export function validateSeedEnvironment(
  environment: Record<string, unknown>,
): SeedEnvironment {
  return seedValidationSchema.parse(environment);
}
