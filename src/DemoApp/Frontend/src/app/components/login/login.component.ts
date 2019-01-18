import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  lForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  ngOnInit() {
    if (this.userService.getToken()) {
      if (this.userService.checkUser()) { this.router.navigate(['user']); } else { this.router.navigate(['admin']); }
    }
  }

  navRegister() {
    this.router.navigate(['register']);
  }

  navForgotPassword() {
    this.router.navigate(['forgotPassword']);
  }

  check(data) {
    if (data.user.email === 'admin@admin.com') { return true; } else { return false; }
  }

  onSubmit() {
    if (!this.lForm.valid) {
      alert('Invalid login credentials!!');
    } else { this.userService.postLogin(this.lForm.value).subscribe(
      (data) => {
        this.userService.auth(data);
        if (this.check(data)) {
          this.router.navigate(['admin']);
        } else { this.router.navigate(['user']); }
      },
      (err) => {
        alert(err.error.message);
      }
    );
    }
  }

}
