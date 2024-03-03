import { NestFactory ,Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {Logger} from '@nestjs/common';
import * as config from 'config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as express from 'express';


async function bootstrap() {
  
  const logger= new Logger('bootstrap');
  const serverConfig= config.get('server');
  const app = await NestFactory.create(AppModule);
  const port= process.env.PORT ||  serverConfig.port;

  const swag = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, swag);
  SwaggerModule.setup('api', app, document);


 
  const reflector = app.get(Reflector);
  

  app.enableCors();
  app.use(express.json());

  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap();
