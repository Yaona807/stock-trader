# -*- coding: utf-8 -*-

from SBIController import SBIController
from chartAnalysis import chartAnalysis
import settings

def main():
  # 初期設定
  user_id = settings.user_id
  pass_word = settings.pass_word
  stock_code = settings.stock_code

  # SBI = SBIController()

  # print('ログイン中')
  # SBI.login(user_id, pass_word)
  # print('URL取得中')
  # chart_url = SBI.getChartImageURL(stock_code)
  # SBI.close()
  chart_url = 'https://chart.iris.sbisec.co.jp/sbi/as/Mchart-mchart.html?ricCode=6696.T&type=real&hash=266ba144777201a58f8c8705342a7b2ab5c64612&size=0&mode=1&DaysNum=1&main=L&addon=SMA3&sub=None&TP=0&side=0&exdvMark=0&param1=25&param2=75&param3=200&diffquote=None&rand=1674571048740'
  CA = chartAnalysis()
  CA.readImageForUrl(chart_url)
  CA.analyze()

if __name__ == '__main__':
  main()
