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
    formData.append('files', this.heaFile, date.getTime().toString() + '.hea');
    formData.append('files', this.datFile, date.getTime().toString() + '.dat');
    formData.append('_id', this.userService.user._id);
    formData.append('date', date.toString());
    formData.append('name', date.getTime().toString());
    this.userService.uploadFile(formData).subscribe(
      (data) => {
        alert('Uploaded files Successfully');
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
