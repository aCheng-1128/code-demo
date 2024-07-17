import { Controller, Post, Body } from '@nestjs/common';
import { WenxinService } from './wenxin.service';

@Controller('wenxin')
export class WenxinController {
  constructor(private readonly wenxinService: WenxinService) {}

  @Post('call')
  async callApi(@Body() body: any) {
    const response = await this.wenxinService.callApi(body);
    return response;
  }
}
