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

  onDeaFileSelect(event) {
    this.datFile = <File> event.target.files[0];
  }

  onUploadHea() {
    const hea = new FormData();
    hea.append('hea', this.heaFile, this.heaFile.name);
    this.userService.uploadHeaFile({hea: hea}).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  onUploadDat() {
    const dat = new FormData();
    dat.append('dat', this.datFile);
    this.userService.uploadDatFile({dat: dat}).subscribe(
      (data) => {
        console.log(data);
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
