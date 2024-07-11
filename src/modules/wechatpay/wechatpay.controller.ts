import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { WechatpayService } from './wechatpay.service';
import { Response } from 'express';
import * as request from 'request-promise-native';
import { wechatpayConfig } from './wechatpay.config';
import { JwtAuthGuard } from '../auth/jwtAuth.guard';

@UseGuards(JwtAuthGuard)
@Controller('wechatpay')
export class WechatpayController {
  constructor(private readonly wechatpayService: WechatpayService) {}

  @Post('unifiedorder')
  async unifiedorder(@Body() body: any) {
    // 验证请求体参数
    try {
      this.validateRequestBody(body);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const timestamp = Math.floor(Date.now() / 1000).toString(); // 当前时间戳

    // 构造统一下单请求参数
    const params = {
      appid: wechatpayConfig.appid,
      mch_id: wechatpayConfig.mch_id,
      nonce_str: this.wechatpayService.generateNonceStr(), // 生成随机字符串
      body: body.productName, // 商品描述
      out_trade_no: body.orderNo, // 商户订单号
      total_fee: body.totalFee, // 总金额，单位：分
      spbill_create_ip: body.ipAddress, // 终端 IP
      notify_url: wechatpayConfig.notify_url, // 通知地址
      trade_type: 'JSAPI',
      openid: body.openid, // 用户 openid
      sign_type: 'MD5',
    };
    params['sign'] = this.wechatpayService.generateSign(params); // 生成签名

    console.log(params);

    try {
      // 发送统一下单请求
      const responseXml = await request.post({
        url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
        body: this.wechatpayService.buildXmlRequest(params),
      });

      // 解析响应结果
      const result = await this.wechatpayService.parseXmlResponse(responseXml);

      console.log(result);

      if (
        result.return_code === 'SUCCESS' &&
        result.result_code === 'SUCCESS'
      ) {
        // 构造返回给客户端的支付参数
        const responseParams = {
          appId: wechatpayConfig.appid,
          timeStamp: timestamp,
          nonceStr: this.wechatpayService.generateNonceStr(),
          package: `prepay_id=${result.prepay_id}`,
          signType: 'MD5',
        };
        responseParams['paySign'] =
          this.wechatpayService.generateSign(responseParams); // 生成支付签名

        return responseParams;
      } else {
        // 处理微信支付接口返回的错误
        throw new InternalServerErrorException(
          result.err_code_des || '统一下单失败',
        );
      }
    } catch (error) {
      // 处理请求过程中发生的错误
      throw new InternalServerErrorException(
        error.message || '统一下单请求失败',
      );
    }
  }

  private validateRequestBody(body: any): void {
    if (!body.productName) throw new Error('缺少商品描述');
    if (!body.orderNo) throw new Error('缺少商户订单号');
    if (!body.totalFee) throw new Error('缺少总金额');
    if (!body.ipAddress) throw new Error('缺少终端 IP');
    if (!body.openid) throw new Error('缺少用户 openid');
  }

  @Post('notify')
  async notify(@Req() request, @Res() response: Response) {
    const notifyXml = request.rawBody; // 获取原始的请求体内容

    try {
      // 解析 XML 请求体
      const data = await this.wechatpayService.parseXml(notifyXml);

      if (data.return_code === 'SUCCESS' && data.result_code === 'SUCCESS') {
        // TODO: 处理支付成功的业务逻辑，例如更新订单状态等
        const successResponse =
          '<xml><return_code><![CDATA[SUCCESS]]></return_code></xml>';
        response.status(HttpStatus.OK).send(successResponse);
      } else {
        // 处理微信支付接口返回的错误
        const errorMessage = data.err_code_des || '支付失败';
        throw new InternalServerErrorException(errorMessage);
      }
    } catch (error) {
      // 处理解析和业务逻辑中的错误
      const errorResponse =
        '<xml><return_code><![CDATA[FAIL]]></return_code></xml>';
      response.status(HttpStatus.INTERNAL_SERVER_ERROR).send(errorResponse);
    }
  }
}
