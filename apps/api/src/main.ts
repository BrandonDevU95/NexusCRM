import "reflect-metadata";

import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./app.module";
import { ConfigService, ConfigType } from "@nestjs/config";
import AppConfig from "./config/app.config";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter";
import { RequestLoggerInterceptor } from "./common/interceptors/request-logger.interceptor";

import cookieParser = require("cookie-parser");

async function bootstrap() {
  const bootstrapLogger = new Logger("Bootstrap");

  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug"],
  });

  const config = app.get(ConfigService);
  const env = config.get<ConfigType<typeof AppConfig>>("env");

  if (!env) {
    throw new Error('Environment configuration "env" not found');
  }

  app.setGlobalPrefix(env.API_GLOBAL_PREFIX);
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser());
  app.enableCors({
    origin: env.WEB_ORIGIN,
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        exposeUnsetFields: true,
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggerInterceptor());

  const swaggerConfig = new DocumentBuilder()
    .setTitle("NexusCRM API")
    .setDescription("Modular CRM API")
    .setVersion("0.1.0")
    .addCookieAuth("access_token")
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${env.API_GLOBAL_PREFIX}/docs`, app, document);

  bootstrapLogger.log(`Application starting on port ${env.API_PORT}`);
  bootstrapLogger.log(`Global prefix: /${env.API_GLOBAL_PREFIX}`);

  await app.listen(env.API_PORT);
  bootstrapLogger.log(
    `Application is running on http://localhost:${env.API_PORT}/${env.API_GLOBAL_PREFIX}`,
  );
}

void bootstrap();
