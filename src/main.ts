import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000', // Разрешаем только этот домен
    credentials: true, // Разрешаем передачу куки
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Разрешаем только эти методы
    allowedHeaders: ['Content-Type'], // Разрешаем только этот заголовок
    exposedHeaders: ['Set-Cookie'], // Разрешаем передачу куки
  });

  app.use(cookieParser());
  app.use(bodyParser.json({limit: '1mb'}));
  app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
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
