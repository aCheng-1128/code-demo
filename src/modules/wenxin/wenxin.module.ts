import { Module } from '@nestjs/common';
import { WenxinService } from './wenxin.service';
import { WenxinController } from './wenxin.controller';

@Module({
  providers: [WenxinService],
  controllers: [WenxinController],
})
export class WenxinModule {}
