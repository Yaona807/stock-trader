from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
import time

class SBIController:
  def __init__(self):
    # seleniumの準備
    service = Service(ChromeDriverManager().install())
    options = Options()
    options.headless = True
    self.driver = webdriver.Chrome(service=service, options=options)
    self.wait = WebDriverWait(driver=self.driver, timeout=30)

    # SBI証券のHPに移動する
    self.driver.get('https://www.sbisec.co.jp/ETGate')

  def login(self, user_id, pass_word):
    self.__moveHOME()

    try:
      # IDの入力 
      id_input_box = self.driver.find_element(by=By.NAME, value='user_id')
      id_input_box.send_keys(user_id)

      # パスワードの入力
      pass_word_input_box = self.driver.find_element(by=By.NAME, value='user_password')
      pass_word_input_box.send_keys(pass_word)

      # ログイン
      login_button = self.driver.find_element(by=By.NAME, value='ACT_login')
      login_button.click()
      self.__waitForDisplay()
    except Exception as e:
      print('ログイン失敗です\n', e)
      self.close()

  def getChartImageURL(self, stock_code):
    # チャート画面へ移動
    self.__moveStockChart(stock_code)

    # パラメータ設定
    self.__setSMAValue(5, 75, 200)

    # チャートの期間を設定
    self.__setChartTerm('1日', '1分足')

    try:
      # iframeへスイッチ
      iframe = self.driver.find_element(by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
      self.driver.switch_to.frame(iframe)

      chart_image_element = self.driver.find_element(by=By.ID, value='chartImg')
      chart_image_url = chart_image_element.get_attribute('src')
    except Exception as e:
      print('チャート画像の取得に失敗しました\n', e)
      self.close()

    self.__waitForDisplay()

    # iframeから戻す
    self.driver.switch_to.default_content()

    return chart_image_url

  def __setChartTerm(self, term, periodicity):
    self.__waitForDisplay()

    try:
      # iframeへスイッチ
      iframe = self.driver.find_element(by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
      self.driver.switch_to.frame(iframe)

      term_button = self.driver.find_element(by=By.LINK_TEXT, value=term)
      term_button.click()
      self.__waitForDisplay()

      select_box = self.driver.find_element(By.NAME, 'mode')
      select = Select(select_box)

      select.select_by_visible_text(periodicity)

    except Exception as e:
      print('チャートの期間の設定に失敗しました\n', e)
      self.close()

    self.__waitForDisplay()

    # iframeから戻す
    self.driver.switch_to.default_content()

  def __setSMAValue(self, short_term, medium_term, long_term):
    self.__waitForDisplay()

    try:
      # iframeへスイッチ
      iframe = self.driver.find_element(by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
      self.driver.switch_to.frame(iframe)

      short_term_input_box = self.driver.find_element(by=By.ID, value="param1")
      short_term_input_box.clear()
      short_term_input_box.send_keys(short_term)

      medium_term_input_box = self.driver.find_element(by=By.ID, value="param2")
      medium_term_input_box.clear()
      medium_term_input_box.send_keys(medium_term)

      long_term_input_box = self.driver.find_element(by=By.ID, value="param3")
      long_term_input_box.clear()
      long_term_input_box.send_keys(long_term)

      show_chart_button = self.driver.find_element(by=By.ID, value="showChart")
      show_chart_button.click()
    except Exception as e:
      print('単純移動平均線のパラメータ設定に失敗しました\n', e)
      self.close()

    self.__waitForDisplay()

    # iframeから戻す
    self.driver.switch_to.default_content()

  def __moveStockChart(self, stock_code):
    # 銘柄検索
    self.__searchStock(stock_code)

    try:
      chart_button = self.driver.find_element(by=By.XPATH, value='//*[@id="main"]/form[2]/div[3]/div/div/table/tbody/tr[1]/td[3]/span/a')
      chart_button.click()
      self.__waitForDisplay()
    except Exception as e:
      print('チャート画面への移動に失敗しました\n', e)
      self.close()


  def __moveHOME(self):
    self.__waitForDisplay()

    try:
      HOME_button = self.driver.find_element(by=By.XPATH, value='//*[@id="navi01P"]/ul/li[1]/a/img')
      HOME_button.click()
      self.__waitForDisplay()
    except Exception as e:
      print('HOME画面への移動に失敗しました\n', e)
      self.close()

  def __searchStock(self, stock_code):
    self.__waitForDisplay()

    # 起点の画面へ移動
    self.__moveHOME()

    try:
      search_input_box = self.driver.find_element(by=By.ID, value="top_stock_sec")
      search_input_box.send_keys(stock_code)
      search_input_box.send_keys(Keys.ENTER)
      self.__waitForDisplay()
    except Exception as e:
      print('銘柄検索に失敗しました\n', e)
      self.close()

  def __waitForDisplay(self):
    # 読み込み完了まで待つ
    self.wait.until(EC.presence_of_all_elements_located)

    # 負荷防止のため、1sは必ず停止する
    time.sleep(1)

  def close(self):
    self.driver.quit()
