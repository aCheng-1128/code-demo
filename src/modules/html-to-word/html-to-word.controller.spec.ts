import { Test, TestingModule } from '@nestjs/testing';
import { HtmlToWordController } from './html-to-word.controller';

describe('HtmlToWordController', () => {
  let controller: HtmlToWordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HtmlToWordController],
    }).compile();

    controller = module.get<HtmlToWordController>(HtmlToWordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
