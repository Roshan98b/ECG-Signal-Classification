import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  focusPassword: boolean;
  focusCPassword: boolean;

  id;
  obj = {
    id: null,
    password: null
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
    ) { }

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    cpassword: new FormControl(null, [Validators.required])
  });

  ngOnInit() {

    this.focusPassword = false;
    this.focusCPassword = false;

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
    });
  }

  onFocus(i) {
    if (i === 1) {
      if (this.focusPassword === false) {
        this.focusPassword = true;
      }
    } else {
      if (this.focusCPassword === false) {
        this.focusCPassword = true;
      }
    }
  }

  navLogin() {
    this.router.navigate(['login']);
  }

  onSubmit() {

    this.obj.id = this.id;
    this.obj.password = this.resetPasswordForm.controls.password.value;

    if (!this.resetPasswordForm.valid) {
      if (!this.resetPasswordForm.controls.password.valid) { alert('Invalid password!!'); }
    } else if (this.resetPasswordForm.controls.password.value !== this.resetPasswordForm.controls.cpassword.value) {
      alert('Confirm Password does not match password!!');
    } else { this.userService.resetPasswordRequest(this.obj).subscribe(
      (message) => {
        console.log(message);
        alert('Your have successfully changed your password!!');
        this.router.navigate(['login']);
      },
      (err) => {
        alert(err.error.message);
      }
    );
          }
   }

}
