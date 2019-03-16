import { Component, OnInit } from '@angular/core';
import { FormBuilder,  FormGroup, Validators } from '@angular/forms';

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

  displayBox = false;
  displayData = null;
  ip = '(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  acquisitionForm: FormGroup;
  focusIP: boolean;
  ipvalid = false;

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

  onStart() {
    this.userService.startAcquisition({ip: this.acquisitionForm.controls.ipaddress.value}).subscribe(
      (data) => {
        this.displayData = data;
        this.displayBox = true;
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
