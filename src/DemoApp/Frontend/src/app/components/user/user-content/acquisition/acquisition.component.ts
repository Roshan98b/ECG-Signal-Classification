import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';
import { Chart } from 'chart.js';

import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-acquisition',
  templateUrl: './acquisition.component.html',
  styleUrls: ['./acquisition.component.css']
})
export class AcquisitionComponent implements OnInit {

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  ecg = [];
  displayBox = false;
  displayData = null;
  ip = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  acquisitionForm: FormGroup;
  focusIP: boolean;
  ipvalid = false;
  ecgChart = [];
  content = false;

  ngOnInit() {
    this.focusIP = false;
    this.acquisitionForm = this.formBuilder.group({
      ipaddress: ['192.168.1.111', [Validators.required, Validators.pattern(this.ip)]]
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
    const ans = [];
    for (let i = start; i <= end; i++) {
        ans.push({
          x: i,
          y: y
        });
    }
    return ans;
  }

  ecgLineChart() {
    const y = this.ecg;
    const data = this.ecgData(y, 1, y.length);
    this.ecgChart = new Chart('ecgCanvas', {
      type: 'line',
      data: data,
      options: {
        elements: {
          line: {
            tension: 0
          },
          animation: {
            duration: 0
          },
          hover: {
            animationDuration: 0
          },
          responsiveAnimationDuration: 0
        }
      }
    });
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
        this.ecg = data.ecg;
        this.displayData = data.result;
        this.displayBox = true;
        if (this.ecg.length === 0) {
          this.content = false;
        } else {
          this.content = true;
        }
        this.ecgLineChart();
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
    this.displayBox = false;
  }

}
