import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService, ConfigType } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import AppConfig from "../config/app.config";
import { createDatabaseOptions } from "./database-options";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const env = config.get<ConfigType<typeof AppConfig>>("env");

        if (!env) {
          throw new Error('Environment configuration "env" not found');
        }

        if (!env.DATABASE_URL) {
          throw new Error("DATABASE_URL is required");
        }

        return createDatabaseOptions(env.DATABASE_URL);
      },
    }),
  ],
})
export class DatabaseModule {}
