import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SbiController } from './sbi/sbi.controller';
import { SbiService } from './sbi/sbi.service';
import { SbiModule } from './sbi/sbi.module';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { StockModule } from './stock/stock.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [SbiModule, StockModule, AuthModule],
  controllers: [AppController, SbiController, StockController, AuthController],
  providers: [AppService, SbiService, StockService, AuthService],
})
export class AppModule {}
