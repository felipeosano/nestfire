import { Express } from 'express-serve-static-core';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';

const loadedFunctions: { [key: string]: any } = {};

export async function createFunction(
  module: any,
  expressServer: Express,
): Promise<INestApplication> {
  const moduleName = module.constructor.name;
  if (loadedFunctions[moduleName]) {
    return loadedFunctions[moduleName];
  }

  const app: INestApplication = await NestFactory.create(module, new ExpressAdapter(expressServer));
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    maxAge: 86400 * 30 * 12,
  });
  const appInit = await app.init();
  loadedFunctions[moduleName] = appInit;

  return appInit;
}
