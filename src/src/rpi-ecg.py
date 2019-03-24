# Flask imports
from flask import Flask, jsonify, request

import time
import board
import busio
import adafruit_ads1x15.ads1115 as ADS
from adafruit_ads1x15.analog_in import AnalogIn

app = Flask(__name__)

@app.route('/aquire_ecg', methods=['GET'])
def acquire_ecg():
    # Create the I2C bus
    i2c = busio.I2C(board.SCL, board.SDA)

    # Create the ADC object using the I2C bus
    ads = ADS.ADS1115(i2c)
    ads.gain = 2/3

    # Create single-ended input on channel 0
    chan = AnalogIn(ads, ADS.P0)

    # 1 second
    timeout = time.time() + 10

    ecg = []
    while time.time() < timeout:
        voltage = chan.voltage
        ecg.append(voltage)
    
    return jsonify({'ecg': ecg})

if __name__ == '__main__':
   app.run(debug=True, host='0.0.0.0')