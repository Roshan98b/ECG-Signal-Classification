import { Component, OnInit } from '@angular/core';

import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-user-display',
  templateUrl: './user-display.component.html',
  styleUrls: ['./user-display.component.css']
})
export class UserDisplayComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getUserRecords().subscribe(
      (data: any[]) => {
        this.userService.allRecords = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
