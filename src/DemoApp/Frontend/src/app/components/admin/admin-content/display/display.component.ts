import { Component, OnInit } from '@angular/core';

import {UserService} from '../../../../services/user/user.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']
})
export class DisplayComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }

  ngOnInit() {
    this.userService.getAllRecords().subscribe(
      (data: any) => {
        this.userService.allRecords = data;
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
