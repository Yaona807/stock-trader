class Chart:
    def __init__(self, style='candle' ,term='1D', periodicity='1m', short_param=5, medium_param=25, long_param=75):
        if style not in ['candle', 'line']:
            raise ValueError('style must be candle or line')
        if term not in ['1D', '2D', '3D', '5D', '10D', '1M', '2M', '3M', '6M', '1Y']:
            raise ValueError('Invalid term')
        if periodicity not in ['1m', '5m', '15m', '60m', '1D', '1W', '1M']:
            raise ValueError('Invalid periodicity')
        if term != '1D' and periodicity == '1m':
            raise ValueError('Invalid periodicity')
        if term not in ['1D', '2D'] and periodicity == '5m':
            raise ValueError('Invalid periodicity')
        if term not in ['1D', '2D', '3D', '5D', '10D'] and periodicity in ['15m', '60m']:
            raise ValueError('Invalid periodicity')
        if term not in ['1M', '2M', '3M', '6M', '1Y'] and periodicity == ['1D', '1W', '1M']:
            raise ValueError('Invalid periodicity')
        if type(short_param) is not int or short_param <= 0 or short_param >= 1000:
            raise ValueError('Invalid short_param')
        if type(medium_param) is not int or medium_param <= 0 or medium_param >= 1000:
            raise ValueError('Invalid medium_param')
        if type(long_param) is not int or long_param <= 0 or long_param >= 1000:
            raise ValueError('Invalid long_param')

        self.style = style
        self.term = term
        self.periodicity = periodicity
        self.short_param = short_param
        self.medium_param = medium_param
        self.long_param = long_param
