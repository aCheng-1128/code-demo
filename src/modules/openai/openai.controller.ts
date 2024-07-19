import { Controller, Post, Body } from '@nestjs/common';
import { OpenAiService } from './openai.service';

@Controller('openai')
export class OpenAiController {
  constructor(private readonly openAiService: OpenAiService) {}

  @Post('chat')
  async chat(@Body('content') content: string): Promise<string> {
    return this.openAiService.getResponse(content);
  }
}
