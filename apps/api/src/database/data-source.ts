import "reflect-metadata";
import { ConfigModule, ConfigType } from "@nestjs/config";
import { DataSource } from "typeorm";
import AppConfig from "../config/app.config";
import { validateDataSourceEnvironment } from "../config/app.validation";
import { createDatabaseOptions } from "./database-options";

async function createAppDataSource(): Promise<DataSource> {
  await ConfigModule.forRoot({
    envFilePath: [".env", "../../.env"],
    load: [AppConfig],
    validate: validateDataSourceEnvironment,
  });

  const env: ConfigType<typeof AppConfig> = AppConfig();

  if (!env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required");
  }

  return new DataSource(createDatabaseOptions(env.DATABASE_URL));
}

const appDataSource = createAppDataSource();

export default appDataSource;
