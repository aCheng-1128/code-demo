import { Controller, Post, Body, Res } from '@nestjs/common';
import { HtmlToWordService } from './html-to-word.service';
import { Response } from 'express';

@Controller('html-to-word')
export class HtmlToWordController {
  constructor(private readonly htmlToWordService: HtmlToWordService) {}

  @Post()
  async convertHtmlToWord(
    @Body('html') html: string,
    @Res() res: Response,
  ): Promise<void> {
    const buffer = await this.htmlToWordService.convertHtmlToWord(html);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': 'attachment; filename=output.docx',
      'Content-Length': buffer.length,
    });
    res.send(buffer);
  }
}
