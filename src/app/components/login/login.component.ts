import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first, takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../base/base.component';
import { ToastService } from '../../services/toast.service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  loginOptionform: FormGroup;
  deviceLoginform: FormGroup;
  bankLoginform: FormGroup;
  loginOptionSelected: String;
  loginOptions: String[] = ['Customer', 'Bank'];
  isDeviceLoginSelected: boolean = false;
  isBankLoginSelected: boolean = false;
  

  constructor(private authService: AuthenticationService, private spinner: NgxSpinnerService, private toastService: ToastService, private router: Router, private formBuilder: FormBuilder) {
    super();
    this.spinner.hide();
  }

  ngOnInit() {
    this.loginOptionform= this.formBuilder.group({
      loginOptionSelected: ['', Validators.required]
    });

    this.deviceLoginform = this.formBuilder.group({
      primaryMobile: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      dob: ['', Validators.required]
    });

    this.bankLoginform = this.formBuilder.group({
      bankCode: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      password: ['', [Validators.required,
        Validators.minLength(8)
      ]]
    });
  }

  isDeviceFieldInvalid(field: string) {
    return (this.deviceLoginform.controls[field].invalid && (this.deviceLoginform.controls[field].dirty || this.deviceLoginform.controls[field].touched));
  }

  isBankFieldInvalid(field: string) {
    return (this.bankLoginform.controls[field].invalid && (this.bankLoginform.controls[field].dirty || this.bankLoginform.controls[field].touched));
  }

  onLoginSelection() {
    if(this.loginOptionform.value.loginOptionSelected == "Customer") {
      this.isDeviceLoginSelected = true;
      this.isBankLoginSelected = false;
    }

    if(this.loginOptionform.value.loginOptionSelected == "Bank") {
      this.isDeviceLoginSelected = false;
      this.isBankLoginSelected = true;
    }
  }

  onDeviceSubmit() {
    this.spinner.show();
    this.authService.deviceLogin(this.deviceLoginform.value)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe(loginResponse => {
        if (loginResponse && loginResponse.message) {
          console.log("Device login successful");
          this.toastService.openSnackBar(loginResponse.message, '', 'error-snackbar');
          this.spinner.hide();
          return;
        }
        this.router.navigate(['mobile-dashboard']);
      }, (err: any) => {
        console.log("Device login failed ", err);
        this.spinner.hide();
        this.toastService.openSnackBar('Invalid Credentials', '', 'error-snackbar');
      });
  }

  onBankSubmit() {
    this.spinner.show();
    this.authService.bankLogin(this.bankLoginform.value)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe(loginResponse => {
        if (loginResponse && loginResponse.message) {
          console.log("Bank login successful");
          this.toastService.openSnackBar(loginResponse.message, '', 'error-snackbar');
          this.spinner.hide();
          return;
        }
        this.router.navigate(['bank-dashboard']);
      }, (err: any) => {
        console.log("Bank login failed ", err);
        this.spinner.hide();
        this.toastService.openSnackBar('Invalid Credentials', '', 'error-snackbar');
      });
  }

  onForgotPassword() {
    this.router.navigate(['forgot-password']);
  }
}


