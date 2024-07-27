import { Module } from '@nestjs/common';
// controllers
import { AppController } from './app.controller';
// services
import { AppService } from './app.service';
// providers
import { ResInterceptor } from './interceptors/response.interceptor';
// modules
import { AuthModule } from './modules/auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { StyleConfigModule } from './modules/styleConfig/styleConfig.module';
import { UsersModule } from './modules/users/users.module';
import { OpenAiModule } from './modules/openai/openai.module';
import { WsModule } from './ws/ws.module';
import { CsvModule } from './modules/csv/csv.module';
import { OthersModule } from './modules/others/others.module';
import { WechatpayModule } from './modules/wechatpay/wechatpay.module';
import { WenxinModule } from './modules/wenxin/wenxin.module';
// config
import { ConfigModule } from '@nestjs/config';
import { HtmlToWordModule } from './modules/html-to-word/html-to-word.module';
import { SsrModule } from './modules/ssr/ssr.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    DatabaseModule,
    UsersModule,
    StyleConfigModule,
    OpenAiModule,
    WsModule,
    CsvModule,
    OthersModule,
    WechatpayModule,
    AuthModule,
    WenxinModule,
    HtmlToWordModule,
    SsrModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'storage'), // 将'storage'文件夹作为静态文件目录
      serveRoot: '/static', // 将文件通过'/static'路径提供
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ResInterceptor],
})
export class AppModule {}
