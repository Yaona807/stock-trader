from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.select import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
from lxml import html
from Order import Order
from Chart import Chart
import time


class SBIController:
    account_manager_selector = {
        'cash': 'body > div > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr > td > form > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(19) > tbody > tr > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(3) > td.mtext > div > font',
        'all_stock_value': 'body > div > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr > td > form > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(19) > tbody > tr > td:nth-child(1) > table:nth-child(7) > tbody > tr:nth-child(6) > td:nth-child(2) > div',
        'stock_table': 'body > div > table > tbody > tr > td:nth-child(1) > table > tbody > tr:nth-child(2) > td > table:nth-child(1) > tbody > tr > td > form > table:nth-child(3) > tbody > tr:nth-child(1) > td:nth-child(2) > table:nth-child(19) > tbody > tr > td:nth-child(3) > table:nth-child(4)'
    }

    def __init__(self):
        # seleniumの準備
        service = Service(ChromeDriverManager().install())
        options = Options()
        options.headless = True and False
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(driver=self.driver, timeout=30)

        # SBI証券のHPに移動する
        self.driver.get('https://www.sbisec.co.jp/ETGate')

    def login(self, user_id, pass_word):
        self.__moveHOME()

        try:
            # IDの入力
            id_input_box = self.driver.find_element(
                by=By.NAME, value='user_id')
            id_input_box.send_keys(user_id)

            # パスワードの入力
            pass_word_input_box = self.driver.find_element(
                by=By.NAME, value='user_password')
            pass_word_input_box.send_keys(pass_word)

            # ログイン
            login_button = self.driver.find_element(
                by=By.NAME, value='ACT_login')
            login_button.click()
            self.__waitForDisplay()
        except Exception as e:
            print('ログイン失敗です\n', e)
            self.close()

    def getChartImageURL(self, stock_code, chart):
        if type(stock_code) is not int and stock_code.isdecimal() == False:
            raise ValueError('stock_codeの型が不正です')
        if isinstance(chart, Chart) == False:
            raise ValueError('chartの型が不正です')

        term_dict = {
            '1D': '1日',
            '2D': '2日',
            '3D': '3日',
            '5D': '5日',
            '10D': '10日',
            '1M': '1ケ月',
            '2M': '2ケ月',
            '3M': '3ケ月',
            '6M': '6ケ月',
            '1Y': '1年',
        }
        periodicity_dict = {
            '1m': '1分足',
            '5m': '5分足',
            '15m': '15分足',
            '60m': '1時間足',
            '1D': '日足',
            '1W': '週足',
            '1M': '月足',
        }

        # チャート画面へ移動
        self.__moveStockChart(stock_code)

        # チャートスタイルを設定
        self.__setChartStyle(chart.style)

        # パラメータ設定
        self.__setSMAValue(chart.short_param,
                           chart.medium_param, chart.long_param)

        # チャートの期間を設定
        self.__setChartTerm(term_dict[chart.term],
                            periodicity_dict[chart.periodicity])

        try:
            # iframeへスイッチ
            iframe = self.driver.find_element(
                by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
            self.driver.switch_to.frame(iframe)

            chart_image_element = self.driver.find_element(
                by=By.ID, value='chartImg')
            chart_image_url = chart_image_element.get_attribute('src')
        except Exception as e:
            print('チャート画像の取得に失敗しました\n', e)
            self.close()

        self.__waitForDisplay()

        # iframeから戻す
        self.driver.switch_to.default_content()

        return chart_image_url

    def orderStock(self, order, trading_password=None):
        if isinstance(order, Order) == False:
            raise TypeError('"order" must be an instance of "Order"')
        if trading_password == None:
            raise TypeError('"trading_password" must be specified')

        self.__moveHOME()

        try:
            order_button = self.driver.find_element(
                by=By.XPATH, value='//*[@id="sb_userinfo_02_torihiki"]/a')
            order_button.click()
            self.__waitForDisplay()

            order_type_button = self.driver.find_element(
                by=By.ID, value='genK') if order.trading_type == 'Buy' else self.driver.find_element(by=By.ID, value='genU')
            order_type_button.click()

            stock_code_input = self.driver.find_element(
                by=By.NAME, value='stock_sec_code')
            stock_code_input.send_keys(order.stock_code)
            stock_code_input.send_keys(Keys.ENTER)
            self.__waitForDisplay()

            market_select_box = Select(self.driver.find_element(
                by=By.ID, value='input_market_normal'))
            for option in market_select_box.options:
                if option.get_attribute('value') == order.market_type:
                    market_select_box.select_by_value(order.market_type)
            else:
                market_select_box.select_by_index(0)

            self.__waitForDisplay()

            stock_number_input = self.driver.find_element(
                by=By.ID, value='input_quantity')
            stock_number_input.send_keys(order.stock_number)

            order_radio = [
                self.driver.find_element(by=By.ID, value='sashine'),
                self.driver.find_element(by=By.ID, value='nariyuki'),
            ]
            order_radio[order.order_type].click()

            if order.order_type == 0:
                price_input = self.driver.find_element(
                    by=By.ID, value='input_price')
                price_input.send_keys(order.order_price)

            deposit_category_radio = self.driver.find_elements(
                by=By.CSS_SELECTOR, value='#normal > tbody > tr:nth-child(6) > td > table > tbody > tr:nth-child(2) > td > label')

            for i in range(len(deposit_category_radio)):
                if deposit_category_radio[i].text == '特定預り':
                    deposit_category_radio[i].click()

            self.__waitForDisplay()

            password_input = self.driver.find_element(by=By.ID, value='pwd3')
            password_input.send_keys(trading_password)

            # 注文を確定させる
            self.driver.find_element(by=By.ID, value='shouryaku').click()
            self.driver.find_element(
                by=By.CSS_SELECTOR, value='#botton2 > img').click()
            self.__waitForDisplay()

            if '注文受付' in self.driver.find_element(by=By.CLASS_NAME, value='md-l-heading-00-inner').text:
                print(
                    f'注文受付に成功しました: 証券コード{order.stock_code}を{order.stock_number}株 {order.trading_type} Order'
                )
            else:
                raise Exception('注文受付に失敗しました')

        except Exception as e:
            print('株の注文に失敗しました\n', e)
            self.close()

    def getAssetsHeld(self):
        self.__moveHOME()

        def _getFormatTextNumber(target_number):
            return target_number.replace('\xa0', '').replace(',', '')

        def _getStockList(stock_table):
            all_stock_info_list = []
            for i, stock_info in enumerate(stock_table.tbody.contents):
                # 見出しなどは除外
                if i < 2:
                    continue

                stock_info_list = list(stock_info.get_text(
                    separator='\n').replace('\xa0', '').split('\n'))
                if i % 2 == 0:
                    all_stock_info_list.append({
                        'stock_code': stock_info_list[0],
                        'stock_name': stock_info_list[1],
                    })
                else:
                    all_stock_info_list[-1]['shares_held_number'] = int(
                        _getFormatTextNumber(stock_info_list[0]))
                    all_stock_info_list[-1]['acquisition_price'] = int(
                        _getFormatTextNumber(stock_info_list[1]))
                    all_stock_info_list[-1]['current_price'] = int(
                        _getFormatTextNumber(stock_info_list[2]))
                    all_stock_info_list[-1]['valuation'] = int(
                        _getFormatTextNumber(stock_info_list[3]))

            return all_stock_info_list

        try:
            account_management_button = self.driver.find_element(
                by=By.XPATH, value='//*[@id="MAINAREA01"]/div[2]/div[1]/div/div/div/div/table/tbody/tr/td[2]/ul/li/a')
            account_management_button.click()
            self.__waitForDisplay()
            soup = BeautifulSoup(self.driver.page_source, 'lxml')
            assets_held = {
                'cash': int(_getFormatTextNumber((soup.select_one(self.account_manager_selector['cash']).text))),
                'all_stock_value': int(_getFormatTextNumber(soup.select_one(self.account_manager_selector['all_stock_value']).text)),
                'all_stock_list': _getStockList(soup.select_one(self.account_manager_selector['stock_table'])),
            }
        except Exception as e:
            print('保有資産の取得に失敗しました\n', e)
            self.close()

        return assets_held

    def __setChartStyle(self, style):
        self.__waitForDisplay()

        chart_style_dict = {
            'candle': 'ローソク足',
            'line': 'ラインチャート',
        }
        try:
            # iframeへスイッチ
            iframe = self.driver.find_element(
                by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
            self.driver.switch_to.frame(iframe)

            chart_type_select = Select(
                self.driver.find_element(by=By.ID, value='chartType'))
            chart_type_select.select_by_visible_text(chart_style_dict[style])

        except Exception as e:
            print('チャートのスタイル設定に失敗しました\n', e)
            self.close()

        self.__waitForDisplay()

        # iframeから戻す
        self.driver.switch_to.default_content()

    def __setChartTerm(self, term, periodicity):
        self.__waitForDisplay()

        try:
            # iframeへスイッチ
            iframe = self.driver.find_element(
                by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
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

    def __setSMAValue(self, short_param, medium_param, long_param):
        self.__waitForDisplay()

        try:
            # iframeへスイッチ
            iframe = self.driver.find_element(
                by=By.XPATH, value='//*[@id="main"]/div[6]/iframe')
            self.driver.switch_to.frame(iframe)

            short_param_input_box = self.driver.find_element(
                by=By.ID, value="param1")
            short_param_input_box.clear()
            short_param_input_box.send_keys(short_param)

            medium_param_input_box = self.driver.find_element(
                by=By.ID, value="param2")
            medium_param_input_box.clear()
            medium_param_input_box.send_keys(medium_param)

            long_param_input_box = self.driver.find_element(
                by=By.ID, value="param3")
            long_param_input_box.clear()
            long_param_input_box.send_keys(long_param)

            show_chart_button = self.driver.find_element(
                by=By.ID, value="showChart")
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
            chart_button = self.driver.find_element(
                by=By.XPATH, value='//*[@id="main"]/form[2]/div[3]/div/div/table/tbody/tr[1]/td[3]/span/a')
            chart_button.click()
            self.__waitForDisplay()
        except Exception as e:
            print('チャート画面への移動に失敗しました\n', e)
            self.close()

    def __moveHOME(self):
        self.__waitForDisplay()

        if self.driver.title == 'SBI証券｜株・FX・投資信託・確定拠出年金・NISA':
            return

        try:
            HOME_button = self.driver.find_element(
                by=By.XPATH, value='//*[@id="navi01P"]/ul/li[1]/a/img')
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
            search_input_box = self.driver.find_element(
                by=By.ID, value="top_stock_sec")
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
