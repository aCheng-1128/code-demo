import {
  Controller,
  Post,
  Body,
  Res,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ResumeService } from './resume.service';

@Controller('resume')
export class ResumeController {
  constructor(private readonly resumeService: ResumeService) {}

  @Post('getResumePdf')
  async getResumePdf(@Body('url') url: string, @Res() res: Response) {
    try {
      const pdfBuffer = await this.resumeService.generateResumePDF(url);
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      });
      res.send(pdfBuffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error generating PDF:', error);
      throw new HttpException(
        'Failed to generate PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('getResumePng')
  async getResumePng(@Body('url') url: string, @Res() res: Response) {
    try {
      const pngBuffer = await this.resumeService.generateResumePng(url);
      res.set({
        'Content-Type': 'image/png',
        'Content-Disposition': 'attachment; filename="resume.png"',
      });
      res.send(pngBuffer);
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('Error generating PNG:', error);
      throw new HttpException(
        'Failed to generate PNG',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
