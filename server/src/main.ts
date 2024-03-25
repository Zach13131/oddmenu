import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionsFilter } from './filters/global.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';

const { PORT, ANY_ORIGIN, FRONTEND_URL, HERE } = process.env;

console.log('file: main.ts:12 ~ HERE:', HERE);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new GlobalExceptionsFilter());

  const config = new DocumentBuilder()
    .setTitle('Booking example')
    .setDescription('The Booking API description')
    .setVersion('1.0')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Enter JWT token',
      in: 'header',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.useStaticAssets(join(__dirname, '..', 'images'), {
    prefix: '/images',
  });

  app.enableCors({
    origin: ANY_ORIGIN === 'true' ? true : FRONTEND_URL,
    credentials: true,
  });
  app.use(cookieParser());

  await app.listen(PORT || 3000);
}
bootstrap();
