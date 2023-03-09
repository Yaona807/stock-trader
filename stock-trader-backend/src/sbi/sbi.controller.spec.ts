import { Test, TestingModule } from '@nestjs/testing';
import { SbiController } from './sbi.controller';

describe('SbiController', () => {
  let controller: SbiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SbiController],
    }).compile();

    controller = module.get<SbiController>(SbiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
