import { Module } from '@nestjs/common';
import { HtmlToWordService } from './html-to-word.service';
import { HtmlToWordController } from './html-to-word.controller';

@Module({
  providers: [HtmlToWordService],
  controllers: [HtmlToWordController],
})
export class HtmlToWordModule {}
