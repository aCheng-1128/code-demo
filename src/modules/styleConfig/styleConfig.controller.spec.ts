import { Test, TestingModule } from '@nestjs/testing';
import { StyleConfigController } from './styleConfig.controller';

describe('StyleConfigController', () => {
  let controller: StyleConfigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StyleConfigController],
    }).compile();

    controller = module.get<StyleConfigController>(StyleConfigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
