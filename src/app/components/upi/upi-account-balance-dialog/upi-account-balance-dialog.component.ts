import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../base/base.component';
import { UPIAccountService } from 'src/app/services/upi-account.service';
import { first, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { CommonUtils } from 'src/app/utils/common-utils.service';
import { BankAccountService } from 'src/app/services/bank-accounts.service';
import { UPIAccountModel } from 'src/app/models/upi-account.model';
import { BankAccountModel } from 'src/app/models/bank-accounts.model';
import { ToastService } from 'src/app/services/toast.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upi-account-balance-dialog',
  templateUrl: './upi-account-balance-dialog.component.html',
  styleUrls: ['./upi-account-balance-dialog.component.scss']
})
export class UpiAccountBalanceDialogComponent extends BaseComponent {
  public timeInterval: Subscription;
  public isLoading: Boolean = false;
  public upiAccount: UPIAccountModel;
  public fetchedBalance: string;

  public enableUPIPinButton: Boolean = true;
  public shouldShowUPIPinScreen: Boolean = true;

  public shouldShowAccountBalanceScreen: Boolean = false;
  public currentDevice: any;
  public form: FormGroup;

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private dialogRef: MatDialogRef<UpiAccountBalanceDialogComponent>, @Inject(MAT_DIALOG_DATA) public loadedUpiAccount: UPIAccountModel, private bankAccountService: BankAccountService, private upiAccountService: UPIAccountService, private toastService: ToastService) {
    super();
    this.spinner.hide();
    console.log(loadedUpiAccount)
    this.upiAccount = loadedUpiAccount;
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    this.form = this.formBuilder.group({
      upiPin: ['', [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]]
    });
  };

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }

  onNextBalanceScreen() {
    this.spinner.show();
    this.upiAccount.upiPin = this.form.value.upiPin;
    this.upiAccountService.authenticateUPIPin(this.upiAccount)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((upiAccount: UPIAccountModel) => {
        console.log("registered upi account Details : ", upiAccount);
        this.getAccountBalance();
      }, (err: any) => {
        this.spinner.hide();
        console.log("Failed to load registered accounts due to :", err);
        this.toastService.openSnackBar('Provided UPI PIN is invalid!', 'Try again', '.red-snackbar');
      });
  }

  getAccountBalance() {
    this.bankAccountService.loadBankAccountByNum(this.upiAccount.accNum)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((bankAccount: BankAccountModel) => {
        console.log("bank account balance : ", bankAccount);
        this.fetchedBalance = bankAccount.netAmount;
        this.shouldShowAccountBalanceScreen = true;
        this.shouldShowUPIPinScreen = false;
        this.spinner.hide();
      }, (err: any) => {
        this.spinner.hide();
        console.log("Failed to load registered accounts due to :", err);
        this.toastService.openSnackBar('Cannot process this request now!', 'Try again', '.red-snackbar');
      });
  }

  onAddSelectedAccount() {
    this.isLoading = true;

    setTimeout(() => {
      //this.shouldShowAccountAddedScreen = true;
      this.isLoading = false;
    }, 1500);
  }

  close() {
    this.dialogRef.close();
  }
}
