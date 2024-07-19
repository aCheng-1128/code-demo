import { Injectable } from '@nestjs/common';
import * as htmlDocx from 'html-docx-js';

@Injectable()
export class HtmlToWordService {
  async convertHtmlToWord(html: string): Promise<Buffer> {
    try {
      const docx = htmlDocx.asBlob(html);
      const buffer = Buffer.from(await docx.arrayBuffer());
      return buffer;
    } catch (error) {
      throw new Error(`Failed to convert HTML to DOCX: ${error.message}`);
    }
  }
}
