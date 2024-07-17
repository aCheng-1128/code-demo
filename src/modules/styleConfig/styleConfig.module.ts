import { Module } from '@nestjs/common';
import { StyleConfigService } from './styleConfig.service';
import { StyleConfigController } from './styleConfig.controller';
import { DatabaseModule } from '../../database/database.module';
import { styleConfigProviders } from './styleConfig.providers';

@Module({
  imports: [DatabaseModule],
  providers: [StyleConfigService, ...styleConfigProviders],
  controllers: [StyleConfigController],
})
export class StyleConfigModule {}
