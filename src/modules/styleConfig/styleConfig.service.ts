import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { StyleConfig } from '../../entities/styleConfig.entity';

@Injectable()
export class StyleConfigService {
  constructor(
    @Inject('STYLECONFIG_REPOSITORY')
    private styleConfigRepository: Repository<StyleConfig>,
  ) {}

  async findAll(): Promise<StyleConfig[]> {
    return this.styleConfigRepository.find();
  }
}
