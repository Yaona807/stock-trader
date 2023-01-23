import cv2
import numpy as np
import matplotlib.pyplot as plt
from urllib.request import urlopen

class chartAnalysis:
  # BGR表記
  bullish_candle_stick_color = np.array([51, 0, 255])
  bearish_candle_stick_color = np.array([153, 51, 0])
  short_line_color = np.array([0, 204, 153])
  medium_line_color = np.array([255, 0, 153])
  long_line_color = np.array([0, 51, 255])

  def __init__(self):
      self.image = None

  def readImageForUrl(self, chart_url):
      image_buffer = np.frombuffer(urlopen(chart_url).read(), dtype=np.uint8)
      self.image = self.__resizeImage(cv2.imdecode(image_buffer, cv2.IMREAD_UNCHANGED))

  def __resizeImage(self, image):
      return image[:][:295]

  def show(self, image_name='stock_chart'):
    cv2.imshow(image_name, self.image)
    cv2.waitKey(0)

  def analyze(self):
    image_mask = (
      cv2.inRange(self.image, self.bullish_candle_stick_color, self.bullish_candle_stick_color) |
      cv2.inRange(self.image, self.bearish_candle_stick_color, self.bearish_candle_stick_color) |
      cv2.inRange(self.image, self.short_line_color, self.short_line_color) |
      cv2.inRange(self.image, self.medium_line_color, self.medium_line_color) |
      cv2.inRange(self.image, self.long_line_color, self.long_line_color)
    )

    analyze_image = cv2.bitwise_and(self.image, self.image, mask=image_mask)
    cv2.imshow('', analyze_image)
    cv2.waitKey(0)

    should_buy_stock = (
      self.__isSlopesUpward(analyze_image, self.short_line_color) |
      self.__isSlopesUpward(analyze_image, self.medium_line_color) |
      self.__isSlopesUpward(analyze_image, self.long_line_color)
    )

    if should_buy_stock:
      print('買いサイン点灯中')
    else:
      print('売りサイン点灯中')

  def __isSlopesUpward(self, image, target_color):
    height, width, _ = image.shape
    positions = np.empty((0, 2), int)

    for x in range(width):
      for y in range(height):
        if np.array_equal(image[y][x], target_color):
          positions = np.append(positions, [[x, y]], axis=0)
          continue

    def _calcSlopes(x1, y1, x2, y2):
      # 高さを補正する（y軸は上から0スタートのため） 
      return (y1 - y2) / (x2 - x1)

    slopes = -1
    for i in range(len(positions) - 1):
      slopes = max(slopes, _calcSlopes(positions[i][0], positions[i][1], positions[-1][0], positions[-1][1]))

    return slopes > 0

