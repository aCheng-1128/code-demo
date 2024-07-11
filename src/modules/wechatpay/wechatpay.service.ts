import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { parseString, Builder } from 'xml2js';
import * as crypto from 'crypto';
import { wechatpayConfig } from './wechatpay.config';

@Injectable()
export class WechatpayService {
  // 生成签名
  generateSign(params: Record<string, any>): string {
    const keys = Object.keys(params).sort(); // 按照字典顺序排序参数
    const string =
      keys.map((k) => `${k}=${params[k]}`).join('&') +
      `&key=${wechatpayConfig.key}`; // 拼接字符串
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase(); // 生成 MD5 签名并转换为大写
  }

  // 构造 XML 格式请求数据
  buildXmlRequest(params: Record<string, any>): string {
    const builder = new Builder({ rootName: 'xml', headless: true }); // 创建 XML 构建器
    return builder.buildObject(params); // 构建 XML 字符串
  }

  // 解析 XML 响应
  async parseXmlResponse(xml: string): Promise<any> {
    try {
      const result = await new Promise<any>((resolve, reject) => {
        parseString(xml, { explicitArray: false }, (err, result) => {
          if (err) {
            reject(new InternalServerErrorException('XML 解析失败'));
          } else {
            resolve(result.xml);
          }
        });
      });
      return result;
    } catch (error) {
      throw new InternalServerErrorException('XML 解析失败'); // 处理 XML 解析错误
    }
  }

  // 生成随机字符串
  generateNonceStr(): string {
    return Math.random().toString(36).substr(2, 15); // 生成长度为 15 的随机字符串
  }

  // 解析 XML 请求体
  parseXml(xml: string): Promise<any> {
    return new Promise((resolve, reject) => {
      parseString(xml, { explicitArray: false }, (err, result) => {
        if (err) {
          reject(new InternalServerErrorException('XML 解析失败'));
        } else {
          resolve(result.xml);
        }
      });
    });
  }
}
