import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user/user.service';

@Component({
  selector: 'app-admin-top-nav-bar',
  templateUrl: './admin-top-nav-bar.component.html',
  styleUrls: ['./admin-top-nav-bar.component.css']
})
export class AdminTopNavBarComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  ngOnInit() {
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }
}
