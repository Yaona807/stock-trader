import { Test, TestingModule } from '@nestjs/testing';
import { SbiService } from './sbi.service';

describe('SbiService', () => {
  let service: SbiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SbiService],
    }).compile();

    service = module.get<SbiService>(SbiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
