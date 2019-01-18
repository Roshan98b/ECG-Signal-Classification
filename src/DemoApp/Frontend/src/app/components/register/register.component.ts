import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, DoCheck {

  questions: string[] = [
    'What was your childhood nickname?',
    'What school did you attend for sixth grade?',
    'What is the last name of the teacher who gave you your first failing grade?',
    'In what city or town did your mother and father meet?',
    'What is your favorite movie?'
  ];
  default = 'What was your childhood nickname?';

  focusEmail: boolean;
  focusDob: boolean;
  focusMobile: boolean;
  focusPassword: boolean;
  focusCPassword: boolean;
  focusSecAnswer: boolean;

  currentDate: Date;
  dateOfBirth: Date;
  dateValid = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) { }

  rForm: FormGroup = new FormGroup({
    firstname: new FormControl(null),
    lastname: new FormControl(null),
    dob: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.email, Validators.required]),
    gender: new FormControl('Male'),
    contactno: new FormControl(null, [Validators.minLength(10), Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    cpassword: new FormControl(null, [Validators.required]),
    securityQuestion: new FormControl(null, [Validators.required]),
    securityAnswer: new FormControl(null, [Validators.required])
  });

  ngOnInit() {

    this.focusEmail = false;
    this.focusDob = false;
    this.focusMobile = false;
    this.focusPassword = false;
    this.focusCPassword = false;
    this.focusSecAnswer = false;

    this.rForm.controls['securityQuestion'].setValue(this.default, { onlySelf: true });
  }

  ngDoCheck() {
    this.dateValidator();
  }

  dateValidator() {

    this.currentDate = new Date();
    this.dateOfBirth = new Date(this.rForm.controls.dob.value);

    if (this.currentDate.getFullYear() - this.dateOfBirth.getFullYear() < 12) {
      this.dateValid = false;
    } else if (this.currentDate.getFullYear() - this.dateOfBirth.getFullYear() > 12) {
      this.dateValid = true;
         } else {
      if (this.currentDate.getMonth() < this.dateOfBirth.getMonth()) {
        this.dateValid = false;
      } else if (this.currentDate.getMonth() > this.dateOfBirth.getMonth()) {
        this.dateValid = true;
           } else {
        if (this.currentDate.getDay() > this.dateOfBirth.getDay()) {
          this.dateValid = false;
        } else { this.dateValid = true; }
      }
    }

  }

  navLogin() {
    this.router.navigate(['login']);
  }

  onFocus(i) {
    if (i === 1) {
      if (this.focusEmail === false) {
        this.focusEmail = true;
      }
    } else if (i === 2) {
      if (this.focusDob === false) {
        this.focusDob = true;
      }
    } else if (i === 3) {
      if (this.focusMobile === false) {
        this.focusMobile = true;
      }
    } else if (i === 4) {
      if (this.focusPassword === false) {
        this.focusPassword = true;
      }
    } else if (i === 5) {
      if (this.focusCPassword === false) {
        this.focusCPassword = true;
      }
    } else {
      if (this.focusSecAnswer === false) {
        this.focusSecAnswer = true;
      }
    }
  }

  onSubmit() {
    if (!this.dateValid) { this.focusDob = true; } else if (!this.rForm.valid) {
      if (!this.rForm.controls.dob.valid) { this.focusDob = true; }
      if (!this.rForm.controls.email.valid) { this.focusEmail = true; }
      if (!this.rForm.controls.contactno.valid) { this.focusMobile = true; }
      if (!this.rForm.controls.password.valid) { this.focusPassword = true; }
      if (!this.rForm.controls.securityAnswer.valid) { this.focusSecAnswer = true; }
      if (this.rForm.controls.password.value !== this.rForm.controls.cpassword.value) { this.focusCPassword = true; }
    } else { this.userService.postMember(this.rForm.value).subscribe(
      (message) => {
        alert('Registration successful!!');
        console.log(message);
        this.router.navigate(['login']);
      },
      (err) => {
        alert('Registration unsuccessful!! This E-mail ID is already in use.');
        console.log(err);
      }
    );
         }
  }
}
