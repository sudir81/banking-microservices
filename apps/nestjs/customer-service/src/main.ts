import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument, bufferLogs: true,
  });
  app.useLogger(app.get(Logger));

  app.setGlobalPrefix('api', { exclude: ['health']});
  app.enableVersioning( { type: VersioningType.URI, defaultVersion: '1'});
  app.useGlobalPipes(new ValidationPipe({whitelist: true, forbidNonWhitelisted: true, transform: true}));
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder().setTitle('Customer Service').setDescription('Customer registration and profile APIs').setVersion('1.0').addBearerAuth().build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);
  const port = app.get(ConfigService).get<number>('PORT', 3001);
  await app.listen(port);
}
await bootstrap();
