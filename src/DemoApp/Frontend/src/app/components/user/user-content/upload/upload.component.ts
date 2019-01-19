import { Component, OnInit } from '@angular/core';

import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(
    private userService: UserService
  ) {}

  datFile: File = null;
  heaFile: File = null;

  displayBox = false;
  displayData = null;

  ngOnInit() {}

  onHeaFileSelect(event) {
    this.heaFile = <File> event.target.files[0];
  }

  onDatFileSelect(event) {
    this.datFile = <File> event.target.files[0];
  }

  onUpload() {
    const formData = new FormData();
    const date = new Date();
    formData.append('files', this.heaFile, this.heaFile.name);
    formData.append('files', this.datFile, this.datFile.name);
    formData.append('_id', this.userService.user._id);
    formData.append('date', date.toString());
    formData.append('name', this.heaFile.name.slice(0, -4));
    this.userService.uploadFile(formData).subscribe(
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
