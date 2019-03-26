import numpy as np
from statistics import median
import cv2
import matplotlib.pyplot as plt

# Difference between consecutive elements of ecg signal
def diff(values):
    peak = []
    if type(values[0]) is np.ndarray:
        peak = [(values[i]-values[i-1]).tolist()[0] for i in range(1,len(values))]
    elif type(values[0]) is float:
        peak = [(values[i]-values[i-1]) for i in range(1,len(values))]
    return peak

# Mean of all difference values
def mean(values):
    return sum(values)/len(values)

# Find absolute value of all elements
def convert_to_abs(values):
    return [i if i>=0 else -i for i in values]

# Simple moving average
def sma(values, window):
    weights = np.repeat(1.0, window)/window
    smas = np.convolve(values, weights, 'valid')
    return smas

# Add extra points in the beginning
def padding(values, offset):
    temp = [0]*offset
    for x in values:
        temp.append(x)
    return temp

# ReLU Activation to find area under which the R-peak lies 
def activate(values, avg):
    return [i if i > avg else 0.0 for i in values]

# Find all peaks
def peaks(values, ecg):
    flag = False
    x = []
    y = []
    peaks = []
    for i in range(len(values)):
        if flag == True and values[i] == 0:
            peaks.append(x[y.index(max(y))])
            x = []
            y = []
        if values[i] == 0:
            flag = False
        else:
            flag = True
        if flag == True:
            x.append(i)
            y.append(ecg[i])
    return peaks

# Filter T-peaks if it is present
def filter_peaks(values, seconds, frequency):
    avg_no_of_peaks = int(seconds*1.33)
    clip = ((seconds * frequency) // avg_no_of_peaks) // 2
    temp = [values[i] for i in range(1, len(values)) if values[i] - values[i-1] >= clip]
    temp.pop()
    return temp

# Peak Analysis for Dev-ECG Data
def peak_interval(peak):
    interval = [peak[i]-peak[i-1] for i in range(1,len(peak))]
    return sum(interval)//len(interval)

# Create Image from Dev-ECG Data
def create_images(ecg, peak, imean):
    half_range = imean//2
    test_data = []
    for i in peak:
        start = i
        stop = i+half_range
        temp_ecg = [ecg[j] for j in range(start, stop+1)]
        image = plt.figure()
        plt.plot(range(len(temp_ecg)), temp_ecg)
        # image.savefig('../dataset/ECG/test/'+str(i)+'.png')
        image.canvas.draw()
        data = np.frombuffer(image.canvas.tostring_rgb(), dtype=np.uint8)
        data = data.reshape((image.canvas.get_width_height()[::-1]+(3,)))
        data = cv2.cvtColor(data, cv2.COLOR_RGB2BGR)
        data = cv2.resize(data, (432,288), cv2.INTER_LINEAR)
        data = data[288-250:288-35, 56:390]
        data = cv2.resize(data, (int(215/5), int(215/5)), cv2.INTER_LINEAR)
        test_data.append(data)
        del image
        plt.close()
    return test_data

# Peak Detection algorithm
def ecg_peak_detection(values, sma_offset, mean_offset, seconds, frequency):
    # plt.plot(range(len(values)), values, label='ECG')
    # Find difference between consecutive elemnts
    difference = diff(values)
    # plt.plot(range(len(difference)), difference, label='Difference')
    # Convert to absolute values
    absolute_difference = convert_to_abs(difference)
    # plt.plot(range(len(absolute_difference)), absolute_difference, label='Absolute Difference')
    # Simple Moving Average
    moving_average = sma(absolute_difference, sma_offset)
    # plt.plot(range(len(moving_average)), moving_average, label='Simple Moving Average')
    # Pad with zeroes in the beginning
    padded_moving_average = padding(moving_average, (len(values)-len(moving_average))//2)
    # plt.plot(range(len(padded_moving_average)), padded_moving_average, label='Padded Simple Moving Average')
    # Activate values greater that mean + mean_offset
    activate_peaks = activate(padded_moving_average, mean(padded_moving_average)+mean_offset)
    # plt.plot(range(len(activate_peaks)), activate_peaks, label='Activated Peak Areas')
    # Find peaks in the activated region
    all_peaks = peaks(activate_peaks, values)
    # Filter T Peaks
    R_peaks = filter_peaks(all_peaks, seconds, frequency)
    # plt.scatter(R_peaks, [3]*len(R_peaks), label='R Peaks')
    # plt.legend()
    # plt.savefig('../dataset/ECG/test/peaks.png')
    # plt.close()
    return R_peaks