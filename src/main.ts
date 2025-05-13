import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { Session } from 'inspector/promises';
import { max } from 'class-validator';
import * as session from 'express-session';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin:process.env.CLIENT || "http://localhost:3000" || "http://localhost:3000/auth/google" || 'http://localhost:3001', // Разрешаем только этот домен
    credentials: true, // Разрешаем передачу куки
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Разрешаем только эти методы
    //allowedHeaders: ['Content-Type'], // Разрешаем только этот заголовок
    exposedHeaders: ['Set-Cookie'], // Разрешаем передачу куки
  });
  
  app.use(
    cookieParser(),
    session({
      secret: 'secret',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000
      }
    })
  );
  const config = new DocumentBuilder()
  .setTitle('Visiteo API')
  .setDescription('Visiteo API description')
  .setVersion('1.0')
  .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
