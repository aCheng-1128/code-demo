import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CsvService } from './csv.service';
import { Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from '@vue/compiler-sfc';

@Controller('csv')
export class CsvController {
  constructor(private readonly csvService: CsvService) {}

  @Get('upload')
  async renderUploadPage(@Res() res: Response) {
    try {
      const templatePath = path.join(__dirname, 'templates', 'uploadCsv.vue');

      if (!fs.existsSync(templatePath)) {
        console.error('Template file not found at path:', templatePath);
        throw new InternalServerErrorException('Template file not found');
      }

      const fileContent = fs.readFileSync(templatePath, 'utf-8');
      const { descriptor } = parse(fileContent);

      if (!descriptor.template) {
        throw new InternalServerErrorException('Template section not found');
      }

      // 提取并内联样式
      const styleContent = descriptor.styles
        .map((style) => style.content)
        .join('\n');

      const fullHtml = `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Upload CSV</title>
            <style>${styleContent}</style>
          </head>
          <body>
            <div id="app">${descriptor.template.content}</div>
            <script src="https://unpkg.com/vue@3.2.47/dist/vue.global.js"></script>
            <script>
              ${descriptor.script ? descriptor.scriptSetup.content : ''}
              const { createApp, ref } = Vue;
              const app = createApp({
                template: \`${descriptor.template.content}\`,
                setup() {
                  ${descriptor.scriptSetup.content}
                },
              });
              app.mount('#app');
            </script>
          </body>
        </html>
      `;

      res.send(fullHtml);
    } catch (err) {
      console.error('Error rendering upload page:', err);
      res.status(500).send('Server Error');
    }
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response,
  ) {
    try {
      if (!file || !file.buffer) {
        throw new BadRequestException(
          'No file uploaded or file buffer is empty',
        );
      }

      // 将文件内容转换为字符串
      let fileContent = file.buffer.toString();

      // 移除 BOM 字符（如果存在）
      if (fileContent.charCodeAt(0) === 0xfeff) {
        fileContent = fileContent.slice(1);
      }

      const jsonData = await this.csvService.parseCsv(fileContent);
      res.json(jsonData);
    } catch (err) {
      console.error('Error uploading file:', err);
      res.status(500).send('Server Error');
    }
  }
}
