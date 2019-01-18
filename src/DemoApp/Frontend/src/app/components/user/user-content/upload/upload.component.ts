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

  onUploadHea() {
    const hea = new FormData();
    hea.append('heaFile', this.heaFile, this.heaFile.name);
    this.userService.uploadHeaFile(hea).subscribe(
      (data) => {
        alert('Uploaded .hea file Successfully');
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUploadDat() {
    const dat = new FormData();
    dat.append('datFile', this.datFile, this.datFile.name);
    this.userService.uploadDatFile(dat).subscribe(
      (data) => {
        alert('Uploaded .dat file Successfully');
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
