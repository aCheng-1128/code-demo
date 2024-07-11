import { Module } from '@nestjs/common';
import { CsvController } from './csv.controller';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CsvService } from './csv.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(),
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'storage'),
    }),
  ],
  controllers: [CsvController],
  providers: [CsvService],
})
export class CsvModule {}
