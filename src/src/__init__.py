import numpy as np
from statistics import median
import cv2
import matplotlib.pyplot as plt

def diff(values):
    peak = []
    if type(values[0]) is np.ndarray:
        peak = [(values[i]-values[i-1]).tolist()[0] for i in range(1,len(values))]
    elif type(values[0]) is float:
        peak = [(values[i]-values[i-1]) for i in range(1,len(values))]
    return peak

def mean(values):
    return sum(values)/len(values)

def activate(values, avg):
    return [i if i > avg else 0.0 for i in values]

def activate_indices(values):
    length = len(values)
    return [i+1 if values[i] != 0 else 0 for i in range(length)]    

def return_tuple(activate_indices, activate):
    return [i for i in zip(activate_indices, activate)]

def convert_to_abs(values):
    return [i if i>=0 else -i for i in values]

def sma(values, window):
    weights = np.repeat(1.0, window)/window
    smas = np.convolve(values, weights, 'valid')
    return smas

def padding(values, offset):
    temp = [0]*offset
    for x in values:
        temp.append(x)
    return temp

def peaks(values):
    flag = False
    temp = []
    peaks = []
    for i in range(len(values)):
        if flag == True and values[i] == 0:
            peaks.append(int(median(temp)))
            temp = []
        if values[i] == 0:
            flag = False
        else:
            flag = True
        if flag == True:
            temp.append(i)
    return peaks

def filter_peaks(values, seconds, frequency):
    avg_no_of_peaks = int(seconds*1.33)
    clip = ((seconds * frequency) // avg_no_of_peaks) // 2
    temp = [values[i] for i in range(1, len(values)) if values[i] - values[i-1] >= clip]
    temp.insert(0,values[0])
    return temp

def ecg_peak_detection(values, sma_offset, mean_offset, seconds, frequency):
    # Find difference between consecutive elemnts
    difference = diff(values)
    # Convert to absolute values
    absolute_difference = convert_to_abs(difference)
    # Simple Moving Average
    moving_average = sma(absolute_difference, sma_offset)
    # Pad with zeroes in the beginning
    padded_moving_average = padding(moving_average, (len(values)-len(moving_average))//2)
    # Activate values greater that mean + mean_offset
    activate_peaks = activate(padded_moving_average, mean(padded_moving_average)+mean_offset)
    # Find peaks in the activated region
    all_peaks = peaks(activate_peaks)
    # Filter T Peaks
    R_peaks = filter_peaks(all_peaks, seconds, frequency)
    return R_peaks

# Peak Analysis for Dev-ECG Data
def peak_interval(peak):
    interval = [peak[i]-peak[i-1] for i in range(1,len(peak))]
    return sum(interval)//len(interval)

# Create Image from Dev-ECG Data
def create_images(ecg, peak, imean):
    half_range = imean//2
    test_data = []
    for i in peak:
        start = i-half_range
        stop = i+half_range
        temp_ecg = [ecg[j] for j in range(start, stop+1)]
        image = plt.figure()
        plt.plot(range(len(temp_ecg)), temp_ecg)
        image.savefig('../dataset/ECG/test/'+str(i)+'.png')
        image.canvas.draw()
        data = np.frombuffer(image.canvas.tostring_rgb(), dtype=np.uint8)
        data = data.reshape((image.canvas.get_width_height()[::-1]+(3,)))
        data = cv2.cvtColor(data, cv2.COLOR_RGB2BGR)
        data = cv2.resize(data, (432,288), cv2.INTER_LINEAR)
        data = data[288-250:288-35, 56:390]
        data = cv2.resize(data, (int(215/5), int(215/5)), cv2.INTER_LINEAR)
        test_data.append(data)
    return test_data

# Peak Detection for Dev-ECG Data
# def peak_detect(values):
#     n = len(values)
#     mean = sum(values)/n
#     peak_temp = [i for i in range(len(values)) if values[i] > mean+0.5]
#     peak = []
#     if len(peak_temp) != 0:
#         peak = [peak_temp[0]]
#         for i in range(1, len(peak_temp)):
#             if peak_temp[i] < peak_temp[i-1]+5:
#                 if values[i] > values[i-1]:
#                     peak.pop()
#                     peak.append(peak_temp[i])
#             else:
#                 peak.append(peak_temp[i])
#         peak.pop(0)
#         peak.pop()
#         if len(peak) > 15 and len(peak) < 5:
#             peak = []
#     return (peak, mean)
