import { Module } from '@nestjs/common';
import { SbiController } from './sbi.controller';
import { SbiService } from './sbi.service';

@Module({
  providers: [SbiService],
  controllers: [SbiController],
})
export class SbiModule {}
