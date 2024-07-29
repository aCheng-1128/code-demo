import { Module } from '@nestjs/common';
import { CozeService } from './coze.service';
import { CozeController } from './coze.controller';
import { ResumeService } from 'src/modules/resume/resume.service';
import { UsersService } from 'src/modules/users/users.service';

@Module({
  providers: [CozeService, ResumeService, UsersService],
  controllers: [CozeController],
})
export class CozeModule {}
