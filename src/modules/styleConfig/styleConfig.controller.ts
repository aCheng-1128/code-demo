import { Controller, Get } from '@nestjs/common';
import { StyleConfigService } from './styleConfig.service';
import { StyleConfig } from '../../entities/styleConfig.entity';

@Controller('style-config')
export class StyleConfigController {
  constructor(private readonly styleConfigService: StyleConfigService) {}

  @Get()
  async findAll(): Promise<StyleConfig[]> {
    return this.styleConfigService.findAll();
  }
}
