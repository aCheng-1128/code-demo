import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('vueTest')
  getVueTest(): string {
    return `
<template>
  <view class="resume_content">
    <view>阿达阿达大大</view>
  </view>
</template>

<style lang="scss">
.resume_content {
  width: 100%;
  display: flex;
  flex-direction: column;
}
</style>
`;
  }
}
