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
  chart_url = 'https://chart.iris.sbisec.co.jp/sbi/as/Mchart-mchart.html?ricCode=9842.T&type=delay&hash=2499b9a08755f344e61ae2aae195fe2f7cade441&size=0&mode=1&DaysNum=1&main=L&addon=SMA3&sub=None&TP=0&side=0&exdvMark=0&param1=25&param2=75&param3=200&diffquote=None&rand=1674481490675'
  CA = chartAnalysis()
  CA.readImageForUrl(chart_url)
  CA.analyze()

if __name__ == '__main__':
  main()
