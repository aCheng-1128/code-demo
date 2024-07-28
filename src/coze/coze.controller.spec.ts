import { Test, TestingModule } from '@nestjs/testing';
import { CozeController } from './coze.controller';

describe('CozeController', () => {
  let controller: CozeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CozeController],
    }).compile();

    controller = module.get<CozeController>(CozeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
