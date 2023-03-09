# -*- coding: utf-8 -*-

from SBIController import SBIController
from ChartAnalysis import ChartAnalysis
from Order import Order
from Chart import Chart
import settings
import json
import sys


def main(type):
    # 初期設定
    user_id = settings.user_id
    pass_word = settings.pass_word
    trading_password = settings.trading_password
    stock_code = settings.stock_code

    SBI = SBIController()

    # print('ログイン中')
    SBI.login(user_id, pass_word)
    
    if type == 'get_assets_held':
        print(json.dumps(SBI.getAssetsHeld()))
        

if __name__ == '__main__':
    args = sys.argv
    main(args[1])
