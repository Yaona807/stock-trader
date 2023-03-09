import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

@Injectable()
export class StockService {
  async getLatestStockDetails(): Promise<any> {
    return await prisma.$transaction(async (prisma) => {
      const latest_assets_details = await prisma.total_assets.findFirst({
        where: {
          user_id: 1,
        },
        orderBy: {
          id: 'desc',
        },
        select: {
          total_assets: true,
          total_assets_details: {
            select: {
              stock_type: true,
              stock_code: true,
              stock_name: true,
              acquisition_price: true,
              shares_held: true,
              current_price: true,
            },
          },
        },
      });

      return latest_assets_details;
    });
  }
}
