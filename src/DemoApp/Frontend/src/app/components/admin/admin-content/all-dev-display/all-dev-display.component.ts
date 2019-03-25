import { Component, OnInit } from '@angular/core';

import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-all-dev-display',
  templateUrl: './all-dev-display.component.html',
  styleUrls: ['./all-dev-display.component.css']
})
export class AllDevDisplayComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAllDevRecords().subscribe(
      (data: any) => {
        this.userService.allDevRecords = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
