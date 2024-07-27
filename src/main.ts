import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // 启用 CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  // 配置静态文件目录
  app.useStaticAssets(path.join(__dirname, '..', 'storage'));

  await app.listen(3366);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
