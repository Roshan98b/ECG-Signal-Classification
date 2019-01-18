import { Component, OnInit, DoCheck } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user/user.service';

declare var $;

@Component({
  selector: 'app-user-top-nav-bar',
  templateUrl: './user-top-nav-bar.component.html',
  styleUrls: ['./user-top-nav-bar.component.css']
})
export class UserTopNavBarComponent implements OnInit, DoCheck {

  constructor(
    private router: Router,
    private userService: UserService,
    private formBuilder: FormBuilder
  ) { }

  passwordForm1: FormGroup = new FormGroup({
    existingPassword1: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  passwordForm2: FormGroup = new FormGroup({
    existingPassword2: new FormControl(null, [Validators.required, Validators.minLength(6)])
  });

  wForm: FormGroup = new FormGroup({
    money: new FormControl(0, [Validators.required, Validators.min(1)]),
  });

  focusPassword1: boolean;
  focusPassword2: boolean;

  selected = {};
  obj;
  obj1;
  obj2;
  EditForm: FormGroup;
  questions: string[] = [
    'What was your childhood nickname?',
    'What school did you attend for sixth grade?',
    'What is the last name of the teacher who gave you your first failing grade?',
    'In what city or town did your mother and father meet?',
    'What is your favorite movie?'];
  default = 'What was your childhood nickname?';

  pform: FormGroup = new FormGroup({
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    cpassword: new FormControl(null, [Validators.required]),
  });

  focusPassword: boolean;
  focusCPassword: boolean;

  sForm: FormGroup = new FormGroup({
    securityQuestion: new FormControl(null, [Validators.required]),
    securityAnswer: new FormControl(null, [Validators.required])
  });

  focusSecAnswer: boolean;

  focusDob: boolean;
  focusMobile: boolean;

  currentDate: Date;
  dateOfBirth: Date;
  dateValid = false;

  ngOnInit() {

    this.focusDob = false;
    this.focusMobile = false;

    this.EditForm = this.formBuilder.group({
      firstname: null,
      lastname: null,
      dob: [null, [Validators.required]],
      gender: ['Male'],
      email: [this.userService.user.email],
      contactno: [null, [Validators.required, Validators.minLength(10)]],
      balance: [this.userService.user.balance]
    });
  }

  ngDoCheck() {
    this.dateValidator();
  }

  onClickProfile() {

    this.userService.getUser();

    this.selected = {
      firstName: this.userService.user.firstname,
      lastName: this.userService.user.lastname,
      dob: this.userService.user.dob,
      gender: this.userService.user.gender,
      email: this.userService.user.email,
      mobileNumber: this.userService.user.contactno
    };
  }

  dateValidator() {

    this.currentDate = new Date();
    this.dateOfBirth = new Date(this.EditForm.controls.dob.value);

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

  onFocus(i) {
    if (i === 1) {
      if (this.focusDob === false) {
        this.focusDob = true;
      }
    } else if (i === 2) {
      if (this.focusMobile === false) {
        this.focusMobile = true;
      }
    } else if (i === 3) {
      if (this.focusPassword1 === false) {
        this.focusPassword1 = true;
      }
    } else if (i === 4) {
      if (this.focusPassword2 === false) {
        this.focusPassword2 = true;
      }
    } else if (i === 5) {
      if (this.focusPassword === false) {
        this.focusPassword = true;
      }
    } else if (i === 6) {
      if (this.focusCPassword === false) {
        this.focusCPassword = true;
      }
    } else {
      if (this.focusSecAnswer === false) {
        this.focusSecAnswer = true;
      }
    }
  }

  onEdit(i) {
    $('#profileModal').modal('hide');
    this.EditForm.controls['firstname'].setValue(i.firstName);
    this.EditForm.controls['lastname'].setValue(i.lastName);
    const date = new Date(i.dob);
    this.EditForm.controls['dob'].setValue(
      date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
    );
    this.EditForm.controls['gender'].setValue(i.gender);
    this.EditForm.controls['contactno'].setValue(i.mobileNumber);
  }

  onSubmit(i) {
    $('#edit').modal('hide');
    if (!this.dateValid) { alert('You should be at least 12 years old to use this application!!'); }
    if (!this.EditForm.valid) {
      if (!this.EditForm.controls.dob.valid) { alert('Please enter your Date of Birth!!'); }
      if (!this.EditForm.controls.contactno.valid) { alert('Mobile number should have 10 digits'); }
    } else {
      this.userService.postEditedProfile(this.EditForm.value).subscribe(
        (message) => {
          console.log(message);
          const obj = JSON.parse(localStorage.getItem('user'));
          obj.firstname = this.EditForm.controls.firstname.value;
          obj.lastname = this.EditForm.controls.lastname.value;
          obj.dob = this.EditForm.controls.dob.value;
          obj.gender = this.EditForm.controls.gender.value;
          obj.contactno = this.EditForm.controls.contactno.value;
          localStorage.setItem('user', JSON.stringify(obj));
          this.userService.user = obj;
          alert('Your profile has been successfully updated!!');
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }

  checkPasswordValid1() {
    this.obj = {
      id: this.userService.user._id,
      password: this.passwordForm1.controls.existingPassword1.value
    };
    if (!this.passwordForm1.valid) {
      if (!this.passwordForm1.controls.existingPassword1.valid) { this.focusPassword1 = true; }
    } else {
      this.userService.postPassword(this.obj).subscribe(
        (message) => {
          console.log(message);
          this.passwordForm1.reset();
          this.focusPassword = false;
          this.focusCPassword = false;
          $('#changepassword1').modal('hide');
          $('#newpassword').modal('show');
        },
        (err) => {
          alert('Entered password is incorrect!! Please re-type password.');
          this.passwordForm1.reset();
          this.focusPassword1 = false;
          console.log(err);
        }
      );
    }
  }

  checkPasswordValid2() {
    this.obj = {
      id: this.userService.user._id,
      password: this.passwordForm2.controls.existingPassword2.value
    };
    if (!this.passwordForm2.valid) {
      if (!this.passwordForm2.controls.existingPassword2.valid) { this.focusPassword2 = true; }
    } else {
      this.userService.postPassword(this.obj).subscribe(
        (message) => {
          console.log(message);
          this.passwordForm2.reset();
          this.focusSecAnswer = false;
          $('#changepassword2').modal('hide');
          $('#changesecurity').modal('show');
        },
        (err) => {
          alert('Entered password is incorrect!! Please re-type password.');
          this.passwordForm2.reset();
          this.focusPassword2 = false;
          console.log(err);
        }
      );
    }
  }

  gotoProfile1() {
    $('#changepassword1').modal('hide');
    this.passwordForm1.reset();
    $('#profileModal').modal('show');
  }

  gotoProfile2() {
    $('#changepassword2').modal('hide');
    this.passwordForm2.reset();
    $('#profileModal').modal('show');
  }

  changePassword() {
    $('#profileModal').modal('hide');
    this.focusPassword1 = false;
  }

  changeSecurityCredentials() {
    $('#profileModal').modal('hide');
    this.focusPassword2 = false;
    this.sForm.controls['securityQuestion'].setValue(this.default, { onlySelf: true });
  }

  onEnterNewPassword() {
    this.obj1 = {
      id: this.userService.user._id,
      password: this.pform.controls.password.value
    };
    if (!this.pform.valid) {
      if (!this.pform.controls.password.valid) { this.focusPassword = true; }
      if (!this.pform.controls.cpassword.valid) { this.focusCPassword = true; }
    } else if (this.pform.controls.password.value !== this.pform.controls.cpassword.value) {
      alert('Confirm Password does not match password!!');
    } else {
      this.userService.resetPasswordRequest1(this.obj1).subscribe(
        (message) => {
          console.log(message);
          alert('Your have successfully changed your password!!');
          this.pform.reset();
          $('#newpassword').modal('hide');
        },
        (err) => {
          alert(err.error.message);
        }
      );
    }
  }

  onChangedSecurity() {
    this.obj2 = {
      id: this.userService.user._id,
      question: this.sForm.controls.securityQuestion.value,
      answer: this.sForm.controls.securityAnswer.value
    };
    if (!this.sForm.valid) {
      if (!this.sForm.controls.securityAnswer.valid) { this.focusSecAnswer = true; }
    } else {
      this.userService.resetSecurityCredentials(this.obj2).subscribe(
        (message) => {
          console.log(message);
          alert('Your have successfully changed your security credentials!!');
          this.sForm.reset();
          $('#changesecurity').modal('hide');
        },
        (err) => {
          alert(err.error.message);
        }
      );
    }
  }

  onClose() {
    this.wForm.reset();
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }

}
