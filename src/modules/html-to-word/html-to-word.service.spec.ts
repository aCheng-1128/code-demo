import { Test, TestingModule } from '@nestjs/testing';
import { HtmlToWordService } from './html-to-word.service';

describe('HtmlToWordService', () => {
  let service: HtmlToWordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HtmlToWordService],
    }).compile();

    service = module.get<HtmlToWordService>(HtmlToWordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
