import { Test, TestingModule } from '@nestjs/testing';
import { WenxinService } from './wenxin.service';

describe('WenxinService', () => {
  let service: WenxinService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WenxinService],
    }).compile();

    service = module.get<WenxinService>(WenxinService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
