import { Module } from '@nestjs/common';
import { WechatpayController } from './wechatpay.controller';
import { WechatpayService } from './wechatpay.service';

@Module({
  controllers: [WechatpayController],
  providers: [WechatpayService],
})
export class WechatpayModule {}
