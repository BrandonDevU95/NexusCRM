import { describe, expect, it } from "vitest";
import {
  validateDataSourceEnvironment,
  validateEnvironment,
  validateSeedEnvironment,
} from "./app.validation";

const validEnvironment = {
  DATABASE_URL: "postgresql://user:password@localhost:5432/nexuscrm",
  AUTH_API_KEY: "a".repeat(32),
  JWT_ACCESS_SECRET: "b".repeat(32),
  JWT_REFRESH_SECRET: "c".repeat(32),
  JWT_RESET_PASSWORD_SECRET: "d".repeat(32),
};

describe("environment validation", () => {
  it("applies safe application defaults", () => {
    expect(validateEnvironment(validEnvironment)).toMatchObject({
      NODE_ENV: "development",
      API_PORT: 3001,
      API_GLOBAL_PREFIX: "api/v1",
      COOKIE_SECURE: false,
    });
  });

  it("rejects reused access and refresh secrets", () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        JWT_REFRESH_SECRET: validEnvironment.JWT_ACCESS_SECRET,
      }),
    ).toThrow(/JWT_REFRESH_SECRET must be different/);
  });

  it("keeps CLI data source validation limited to its dependency", () => {
    expect(
      validateDataSourceEnvironment({ DATABASE_URL: "postgres://db" }),
    ).toEqual({
      DATABASE_URL: "postgres://db",
    });
  });

  it("coerces seed flags and deterministic faker seed", () => {
    expect(
      validateSeedEnvironment({
        DATABASE_URL: "postgres://db",
        ALLOW_DB_RESET: "true",
        SEED_FAKER_SEED: "42",
      }),
    ).toMatchObject({ ALLOW_DB_RESET: true, SEED_FAKER_SEED: 42 });
  });
});
