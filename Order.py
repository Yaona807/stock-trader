class Order:
    def __init__(self, trading_type, stock_code, stock_number=100, order_type=1, order_price=0, market_type='TKY'):
        if trading_type != 'Buy' and trading_type != 'Sell':
            raise ValueError('Trading type must be "Buy" or "Sell"')
        if type(stock_code) is not int and stock_code.isdecimal() == False:
            raise ValueError('Stock code must be an integer')
        if type(stock_number) is not int and stock_number.isdecimal() == False and stock_number % 100 != 0:
            raise ValueError('Stock number must be an integer multiple of 100')
        if type(order_type) is not int and order_type.isdecimal() == False and order_type not in [0, 1]:
            raise ValueError('Order type must be an integer 0 or 1')
        if order_type != 1 and type(order_price) is not int and order_price.isdecimal() == False and order_price <= 0:
            raise ValueError('Order price must be an integer greater than 0')
        if market_type not in ['TKY', 'PTS']:
            raise ValueError('Market type must be "TKY" or "PTS"')

        self.trading_type = trading_type
        self.stock_code = stock_code
        self.stock_number = stock_number
        self.order_type = order_type
        self.order_price = order_price
        self.market_type = market_type
