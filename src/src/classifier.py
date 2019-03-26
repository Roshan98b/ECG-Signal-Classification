# Filter warning messages
import warnings
warnings.simplefilter(action='ignore', category=FutureWarning)

from flask import Flask, jsonify, request

# To avoid app crashes due to MultiThreading
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

import os, wfdb, cv2
from wfdb import processing
from src import ecg_peak_detection, peak_interval, create_images

# Reduce Tensorflow messages
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf

# Model is loaded using the global object 'graph' 
# 'graph' is used later to predict
# Predict generates error if this is not used as default graph is changed due to MultiThreading 
global graph
graph = tf.get_default_graph()

import numpy as np
import tensorflow as tf
from keras.models import load_model

loaded_model = load_model('../models/cnn_5labels_7.h5')

app = Flask(__name__)

# For MIT-BIH Data
@app.route('/classify', methods=['POST'])
def classify():
    
    # POST request body
    data = request.get_json()
    
    # Import record and find Peaks.
    file_path = '../DemoApp/Backend/uploads/' + data['filename']
    start = 0
    stop = 65000
    record = wfdb.rdrecord(file_path, sampfrom=start, sampto=stop, channels=[0])
    ecg = record.p_signal
    # rqrs = processing.xqrs_detect(record.p_signal[:,0], record.fs)
    rqrs = ecg_peak_detection(ecg, 30, 0.03, (stop-start)/record.fs, record.fs)
    
    # Image Generation 
    # Conversion of Digital signals to Matplotlib Figures to Numpy Arrays
    test_data = []
    for i in range(1, 100):
        start = rqrs[i]
        stop = rqrs[i]+200
        if start<0: 
            start=0
        temp_rec = wfdb.rdrecord(file_path, sampfrom=start,sampto=stop, channels=[0])
        image = plt.figure()
        plt.plot(range(200), temp_rec.p_signal)
        image.canvas.draw()
        data = np.frombuffer(image.canvas.tostring_rgb(), dtype=np.uint8)
        data = data.reshape((image.canvas.get_width_height()[::-1] + (3,)))
        data = cv2.cvtColor(data, cv2.COLOR_RGB2BGR)
        data = cv2.resize(data, (432, 288), cv2.INTER_LINEAR)
        data = data[288-250:288-35, 55:390]
        data = cv2.resize(data, (int(215/5), int(215/5)), cv2.INTER_LINEAR)
        test_data.append(data)
        del image
        plt.close()
    test_data = np.array(test_data)

    # Convert List to Numpy Array
    test_data = np.array(test_data)

    with graph.as_default():
        predictions = loaded_model.predict_classes(test_data).tolist()

    return jsonify({'classes': predictions})

# For Dev-ECG Data
@app.route('/devclassify', methods=['POST'])
def devclassify():
    # POST request body
    data = request.get_json()
    ecg = data['ecg']
    
    frequency = 70
    seconds = 10

    peak = ecg_peak_detection(ecg, 30, 0.03, seconds, frequency)
    print(peak)
    # Disturbance in Signal
    if len(peak) == 0:
        return jsonify({'classes': []})    
    else: 
        imean = peak_interval(peak)
        test_data = create_images(ecg, peak, imean+10)
        
        # Convert List to Numpy Array
        test_data = np.array(test_data)

        with graph.as_default():
            predictions = loaded_model.predict_classes(test_data).tolist()

        return jsonify({'classes': predictions})

if __name__ == '__main__':
   app.run()