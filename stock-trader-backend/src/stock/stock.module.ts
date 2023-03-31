import { Module } from '@nestjs/common';
import { StockController } from './stock.controller';
import { StockService } from './stock.service';

@Module({
  providers: [StockService],
  controllers: [StockController],
})
export class StockModule {}
