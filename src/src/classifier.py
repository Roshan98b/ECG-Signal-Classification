import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

from flask import Flask, jsonify, request

import os, wfdb, cv2
from wfdb import processing

import numpy as np
import matplotlib
matplotlib.use('agg')
import matplotlib.pyplot as plt

import tensorflow as tf
from keras.models import load_model

trained_model = load_model('../models/cnn_3labels_1.h5')

app = Flask(__name__)

@app.route('/classify', methods=['POST'])
def hello_world():
    
    data = request.get_json()
    file_path = '../DemoApp/Backend/uploads/' + data['filename']
    record = wfdb.rdrecord(file_path, channels=[0])
    rqrs = processing.xqrs_detect(record.p_signal[:,0], record.fs)
    
    # Image Generation - Digital signals to Matplotlib Figures to Numpy Arrays
    train_data = []
    for i in range(100, 200):
        start = rqrs[i]
        stop = rqrs[i]+200
        if start<0: 
            start=0
        temp_rec = wfdb.rdrecord(file_path, sampfrom=start,sampto=stop, channels=[0])
        image, axes = plt.subplots()
        plt.plot(range(200), temp_rec.p_signal)
        image.canvas.draw()
        data = np.frombuffer(image.canvas.tostring_rgb(), dtype=np.uint8)
        data = data.reshape((image.canvas.get_width_height()[::-1] + (3,)))
        data = cv2.cvtColor(data, cv2.COLOR_RGB2BGR)
        data = data[288-250:288-35, 55:390]
        data = cv2.resize(data, (int(215/5), int(215/5)), cv2.INTER_LINEAR)
        train_data.append(data)
        plt.close()
    train_data = np.array(train_data)

    return str(train_data[1].shape)

if __name__ == '__main__':
   app.run()