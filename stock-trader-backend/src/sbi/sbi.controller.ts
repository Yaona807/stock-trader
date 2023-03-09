import { Controller, Get, Post } from '@nestjs/common';
import { SbiService } from './sbi.service';

@Controller('sbi')
export class SbiController {
  constructor(private readonly sbiService: SbiService) {}

  @Get('/assets')
  getAssetsHeld(): object {
    return this.sbiService.getAssets();
  }
}
