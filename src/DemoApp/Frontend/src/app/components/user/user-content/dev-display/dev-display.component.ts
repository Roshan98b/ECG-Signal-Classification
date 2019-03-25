import { Component, OnInit } from '@angular/core';

import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-dev-display',
  templateUrl: './dev-display.component.html',
  styleUrls: ['./dev-display.component.css']
})
export class DevDisplayComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getDevRecords().subscribe(
      (data: any[]) => {
        this.userService.allDevRecords = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
