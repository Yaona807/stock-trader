import { Controller, Get, Post } from '@nestjs/common';
import { SbiService } from './sbi.service';

@Controller('sbi')
export class SbiController {
  constructor(private readonly sbiService: SbiService) {}

  @Post('/update/assets')
  updateAssets(): object {
    return this.sbiService.updateAssets();
  }

  @Post('latest/assets')
  getLatestAssets(): object {
    return this.sbiService.getLatestAssets();
  }
}
