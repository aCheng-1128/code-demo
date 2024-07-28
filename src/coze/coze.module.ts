import { Module } from '@nestjs/common';
import { CozeService } from './coze.service';
import { CozeController } from './coze.controller';
import { ResumeService } from 'src/modules/resume/resume.service';

@Module({
  providers: [CozeService, ResumeService],
  controllers: [CozeController],
})
export class CozeModule {}
