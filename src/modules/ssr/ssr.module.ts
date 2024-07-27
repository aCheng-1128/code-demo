import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { SsrController } from './ssr.controller';

@Module({
  controllers: [SsrController],
})
export class SsrModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 可以在这里添加中间件，如果需要的话
  }
}
