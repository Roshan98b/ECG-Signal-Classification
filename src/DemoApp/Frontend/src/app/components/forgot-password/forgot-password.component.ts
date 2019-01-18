import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  questions: string[] = [
    'What was your childhood nickname?',
    'What school did you attend for sixth grade?',
    'What is the last name of the teacher who gave you your first failing grade?',
    'In what city or town did your mother and father meet?',
    'What is your favorite movie?'
  ];
  default = 'What was your childhood nickname?';
  focusEmail: boolean;
  focusSecAnswer: boolean;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  forgotPasswordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    securityQuestion: new FormControl(null, [Validators.required]),
    securityAnswer: new FormControl(null, [Validators.required])
  });

  ngOnInit() {
    this.forgotPasswordForm.controls['securityQuestion'].setValue(this.default, { onlySelf: true });
    this.focusEmail = false;
    this.focusSecAnswer = false;
  }

  onFocus(i) {
    if (i === 1) {
      if (this.focusEmail === false) {
        this.focusEmail = true;
      }
    } else {
      if (this.focusSecAnswer === false) {
        this.focusSecAnswer = true;
      }
    }
  }

  navLogin() {
    this.router.navigate(['login']);
  }

  onSubmit() {
    if (!this.forgotPasswordForm.valid) {
      if (!this.forgotPasswordForm.controls.email.valid) { this.focusEmail = true; }
      if (!this.forgotPasswordForm.controls.securityAnswer.valid) { this.focusSecAnswer = true; }
    } else { this.userService.postPasswordRequest(this.forgotPasswordForm.value).subscribe(
      (message) => {
        console.log(message);
        alert('A link has been sent to your E-mail address through which you will be able to reset your password.');
        this.router.navigate(['login']);
      },
      (err) => {
        alert(err.error.message);
      }
    );
    }
  }
}
