import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, CheckboxControlValueAccessor } from '@angular/forms';
import { Chart } from 'chart.js';

import { UserService } from '../../../../services/user/user.service';

@Component({
  selector: 'app-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.css']
})
export class AcquisitionComponent implements OnInit {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  ecg = [];
  displayBox = false;
  displayError = false;
  content = false;
  displayData = null;
  ip = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  acquisitionForm: FormGroup;
  focusIP: boolean;
  ipvalid = false;
  canvas: any;
  ctx: any;

  ngOnInit() {
    this.focusIP = false;
    this.acquisitionForm = this.formBuilder.group({
      ipaddress: ['192.168.1.6', [Validators.required, Validators.pattern(this.ip)]]
    });
  }

  onFocus(i) {
    if (i === 1) {
      if (this.focusIP === false) {
        this.focusIP = true;
      }
    }
  }

  ecgData(y, start, end) {
    const ans = {
      labels: [],
      datasets: {
        data: []
      }
    };
    for (let i = start; i <= end; i++) {
      ans.labels.push((i / 70).toPrecision(3)).toString();
      ans.datasets.data.push(y[i]);
    }
    return ans;
  }

  ecgLineChart() {
    const data = this.ecgData(this.ecg, 1, this.ecg.length);
    const ecgChart = new Chart('ecgChart', {
      type: 'line',
      data: {
        labels: data.labels,
        datasets: [{
          label: 'ECG Signal',
          data: data.datasets.data,
        }]
      },
      options: {
        scales: {
          yAxes: [{
            gridLines: {
              display: false
            }
          }],
          xAxes: [{
            gridLines: {
              display: false
            }
          }]
        },
        elements: {
          point: {
            radius: 0
          }
        }
      }
    });
    console.log(ecgChart);
  }

  onStart() {
    const date = new Date();
    const obj = {
      _id: this.userService.user._id,
      date: date.toString(),
      ip: this.acquisitionForm.controls.ipaddress.value
    };
    this.userService.startAcquisition(obj).subscribe(
      (data: any) => {
        if (data.result.length === 0) {
          this.displayError = true;
        } else {
          this.content = true;
          this.displayBox = true;
          this.ecg = data.ecg;
          this.displayData = data.result;
          this.ecgLineChart();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onArrhythmia() {
    if (!this.displayData.arrhythmia) {
      return false;
    } else {
      return true;
    }
  }

  onClear() {
    this.content = false;
    this.displayBox = false;
  }

}
