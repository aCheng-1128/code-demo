import { Controller, Get, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { CozeService } from './coze.service';
import { ResumeService } from 'src/modules/resume/resume.service';

@Controller('coze')
export class CozeController {
  constructor(
    private readonly cozeService: CozeService,
    private readonly resumeService: ResumeService,
  ) {}

  @Get('cozeBot')
  async cozeBot(@Query('message') message: string, @Res() res: Response) {
    // 生成会话
    await this.cozeService.genConversation();

    // 生成消息
    await this.cozeService.genMessage(message);

    // 生成对话
    await this.cozeService.genChat();

    // 轮询获取对话状态，直到状态为 completed
    const pollInterval = 1000; // 轮询间隔时间，单位为毫秒
    const maxRetries = 30; // 最大轮询次数
    let retries = 0;

    while (retries < maxRetries) {
      await this.cozeService.chatRetrieve();
      if (this.cozeService.chat_status === 'completed') {
        break;
      }
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      retries++;
    }

    if (this.cozeService.chat_status === 'completed') {
      // 获取对话消息详情
      await this.cozeService.chatMessageList();

      const reusmeUrl = JSON.parse(
        this.cozeService.chat_messages.filter(
          (item) => item.type === 'tool_response',
        )[0].content,
      ).url;

      const pdfBuffer = await this.resumeService.generateResumePDF(reusmeUrl);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      });
      res.send(pdfBuffer);
    } else {
      // 返回对话尚未完成的响应
      res.status(202).send({
        message: 'Chat is not completed yet',
        status: this.cozeService.chat_status,
      });
    }
  }
}
