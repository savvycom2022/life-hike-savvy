import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './common/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: console,
  });
  const configService: ConfigService = app.get(ConfigService);

  const config = new DocumentBuilder()
    .setTitle('Book Store')
    .setDescription('Book Store API description')
    .addTag('Book')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  await app.listen(configService.app.port);
}

bootstrap();
