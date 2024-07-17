import { Test, TestingModule } from '@nestjs/testing';
import { WenxinController } from './wenxin.controller';

describe('WenxinController', () => {
  let controller: WenxinController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WenxinController],
    }).compile();

    controller = module.get<WenxinController>(WenxinController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
