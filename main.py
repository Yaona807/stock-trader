# -*- coding: utf-8 -*-

from SBIController import SBIController
from ChartAnalysis import ChartAnalysis
from Order import Order
from Chart import Chart
import settings


def main():
    # 初期設定
    user_id = settings.user_id
    pass_word = settings.pass_word
    trading_password = settings.trading_password
    stock_code = settings.stock_code

    SBI = SBIController()

    print('ログイン中')
    SBI.login(user_id, pass_word)
    chart = Chart(
        style='line',
        term='1Y',
        periodicity='1D',
        short_param=25,
        medium_param=75,
        long_param=200,
    )
    CA = ChartAnalysis()
    CA.readImageForUrl(SBI.getChartImageURL('9318', chart))
    CA.show()

if __name__ == '__main__':
    main()
