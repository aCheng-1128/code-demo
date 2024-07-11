import { Module } from '@nestjs/common';
import { WsGateway } from './ws.gateway';
import { OpenAiModule } from '../modules/openai/openai.module';

@Module({
  imports: [OpenAiModule],
  providers: [WsGateway],
  exports: [WsGateway],
})
export class WsModule {}
