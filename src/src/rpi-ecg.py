# import board
# import busio
# import adafruit_ads1x15.ads1115 as ADS
# from adafruit_ads1x15.analog_in import AnalogIn

# # Create the I2C bus
# i2c = busio.I2C(board.SCL, board.SDA)

# # Create the ADC object using the I2C bus
# ads = ADS.ADS1115(i2c)
# ads.gain = 2/3

# # Create single-ended input on channel 0
# chan = AnalogIn(ads, ADS.P0)

# # 1 second
# timeout = time.time() + 10

# ecg = []
# while time.time() < timeout:
#     voltage = chan.voltage
#     ecg.append(voltage)

# display = {"length": len(ecg),"value": ecg}
# #print(json.dumps(display, indent = 2))

import time
import numpy as np
import matplotlib.pyplot as ply
import cv2
import json
import matplotlib.pyplot as plt

def sma(values, window):
    weights = np.repeat(1.0, window)/window
    smas = np.convolve(values, weights, 'valid')
    return smas

def ewma(values, window):
    weights = np.exp(np.linspace(-1.,0.,window))
    weights /= weights.sum()
    emas = np.convolve(values,weights)[:len(values)]
    return emas


def peak_detect(values):
    n = len(values)
    mean = sum(values)/n
    peak_temp = [i for i in range(len(values)) if values[i] > mean+0.3]
    peak = [peak_temp[0]]
    for i in range(1, len(peak_temp)):
        if peak_temp[i] < peak_temp[i-1]+5:
            if values[i] > values[i-1]:
                peak.pop()
                peak.append(peak_temp[i])
        else:
            peak.append(peak_temp[i])
    peak.pop(0)
    peak.pop()
    return (peak, mean)

def peak_interval(peak):
    interval = [peak[i]-peak[i-1] for i in range(1,len(peak))]
    return (interval, sum(interval)//len(interval))

def create_images(ecg, peak, imean):
    half_range = imean//2
    test_data = []
    for i in peak:
        start = i-half_range
        stop = i+half_range
        temp_ecg = [ecg[j] for j in range(start, stop+1)]
        image = plt.figure()
        plt.plot(range(len(temp_ecg)), temp_ecg)
        image.canvas.draw()
        data = np.frombuffer(image.canvas.tostring_rgb(), dtype=np.uint8)
        data = data.reshape((image.canvas.get_width_height()[::-1]+(3,)))
        data = cv2.cvtColor(data, cv2.COLOR_RGB2BGR)
        data = cv2.resize(data, (432,288), cv2.INTER_LINEAR)
        data = data[288-250:288-35, 56:390]
        test_data.append(data)
    return test_data

if __name__=='__main__':

    ecg = []

    #smas = sma(ecg, 7)
    #ewmas = ewma(ecg, 4)

    x = range(len(ecg))
    plt.plot(x, ecg)
    plt.show()

    peak, pmean = peak_detect(ecg)
    interval, imean = peak_interval(peak)

    test_data = create_images(ecg, peak, imean)

    #x = range(len(ecg))
    #plt.plot(x, ecg)
    #plt.show()