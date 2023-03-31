import { Injectable } from '@nestjs/common';
import { PythonShell } from 'python-shell';
import { PrismaClient } from '@prisma/client';

type Options = {
  mode: 'json' | 'text';
  args: Array<string>;
  scriptPath: string;
};

type stock = {
  acquisition_price: number;
  current_price: number;
  shares_held: number;
  stock_code: string;
  stock_name: string;
  stock_type: string;
  valuation: number;
};

type assets = {
  all_investment_trust_value: number;
  all_stock_list: Array<stock>;
  all_stock_value: number;
  cash: number;
};

const prisma = new PrismaClient();

@Injectable()
export class SbiService {
  async updateAssets(): Promise<object> {
    const options = {
      mode: 'json',
      args: ['get_assets_held'],
      scriptPath: './src/python',
    } as Options;

    const results = (await PythonShell.run('main.py', options).then(
      (messages: Array<object>) => ({ ...messages[0] }),
    )) as assets;

    return await prisma.$transaction(async (prisma) => {
      const date_time = new Date(new Date().setHours(0, 0, 0, 0));

      await prisma.total_assets
        .findMany({
          select: {
            id: true,
          },
          where: {
            created_at: {
              gte: date_time,
            },
          },
        })
        .then((delete_total_assets) => {
          if (delete_total_assets && delete_total_assets.length == 0) {
            return;
          }

          Promise.all(
            delete_total_assets.map(
              async (dta) =>
                await prisma.total_assets.delete({
                  where: {
                    id: dta.id,
                  },
                }),
            ),
          );
        });

      const total_assets = await prisma.total_assets.create({
        data: {
          user_id: 1,
          total_assets:
            results['all_investment_trust_value'] +
            results['all_stock_value'] +
            results['cash'],
        },
      });

      const total_assets_details = await Promise.all(
        results.all_stock_list.map(async (stock) => {
          return await prisma.total_assets_details.create({
            data: {
              total_assets_id: total_assets.id,
              stock_type: stock.stock_type,
              stock_code: stock.stock_code,
              stock_name: stock.stock_name,
              acquisition_price: stock.acquisition_price,
              shares_held: stock.shares_held,
              current_price: stock.current_price,
            },
            select: {
              stock_type: true,
              stock_code: true,
              stock_name: true,
              acquisition_price: true,
              shares_held: true,
              current_price: true,
            },
          });
        }),
      );

      return {
        total_assets: total_assets.total_assets,
        stocks: total_assets_details,
      };
    });
  }
  async getLatestAssets(): Promise<any> {
    return await prisma.$transaction(async (prisma) => {
      return await prisma.total_assets.findMany({
        where: {
          user_id: 1,
        },
        select: {
          total_assets: true,
          created_at: true,
          total_assets_details: {
            select: {
              stock_code: true,
              stock_name: true,
              shares_held: true,
              stock_type: true,
              acquisition_price: true,
              current_price: true,
              created_at: true,
            },
          },
        },
        orderBy: {
          id: 'desc',
        },
        take: 7,
      });
    });
  }
}
