import { Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseComponent } from '../../base/base.component';
import { UPIAccountService } from 'src/app/services/upi-account.service';
import { first, takeUntil } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { BankAccountService } from 'src/app/services/bank-accounts.service';
import { UPIAccountModel } from 'src/app/models/upi-account.model';
import { BankAccountModel } from 'src/app/models/bank-accounts.model';
import { ToastService } from 'src/app/services/toast.service';
import { UPIPaymentModel } from 'src/app/models/upi-payment.model';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upi-payment-dialog',
  templateUrl: './upi-payment-dialog.component.html',
  styleUrls: ['./upi-payment-dialog.component.scss']
})
export class UpiPaymentDialogComponent extends BaseComponent {
  public timeInterval: Subscription;
  public isLoading: Boolean = false;
  public payerUpiAccount: UPIAccountModel;
  public payeeUpiAccount: UPIAccountModel;
  public fetchedBalance: string;

  public enableUPITransferButton: Boolean = false;
  public shouldShowPayeeUPIScreen: Boolean = true;
  public shouldShowUPITransferScreen: Boolean = false;
  public shouldShowUPIPaymentScreen: Boolean = false;

  public shouldShowAccountBalanceScreen: Boolean = false;
  public currentDevice: any;
  public form: FormGroup;
  public currentDateTime: String;
  public referenceNo: String;
  public paymentStatus: String;
  public rrn: String;
  public dateTime: String;

  public paymentTransferModel: UPIPaymentModel = {
    payerAccount: new UPIAccountModel,
    payeeAccount: new UPIAccountModel,
    txnAmount: ''
  };

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private dialogRef: MatDialogRef<UpiPaymentDialogComponent>, @Inject(MAT_DIALOG_DATA) public loadedUpiAccount: UPIAccountModel, private bankAccountService: BankAccountService, private upiAccountService: UPIAccountService, private toastService: ToastService) {
    super();
    this.spinner.hide();
    this.payerUpiAccount = loadedUpiAccount;
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    this.form = this.formBuilder.group({
      payeeUpiId: ['', [Validators.required,
      Validators.pattern(/^.{10}@/)]],
      amount: ['', [Validators.required,
      Validators.minLength(1),
      Validators.maxLength(5), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      upiPin: ['', [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    });
  };

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }

  isValidPayeeAvailable(event: any) {
    let isFormValid = !this.form.controls['payeeUpiId'].invalid;
    let vpaHandlerValid = (this.form.value.payeeUpiId).length >= 14;

    if (isFormValid && vpaHandlerValid) {
      console.log("fetch the payee account details using vpa: ", this.form.value.payeeUpiId);
      this.loadPayeeUPIAccount();
    }
  }

  onNextTransferScreen() {
    this.shouldShowUPITransferScreen = true;
    this.enableUPITransferButton = false;
    this.shouldShowPayeeUPIScreen = false;
    this.payerUpiAccount.upiPin = this.form.value.upiPin;
  }

  onNextPaymentScreen() {
    this.spinner.show();
    this.paymentTransferModel.payerAccount = this.payerUpiAccount;
    this.paymentTransferModel.payeeAccount = this.payeeUpiAccount;
    this.paymentTransferModel.txnAmount = this.form.value.amount;
    this.paymentTransferModel.payerAccount.upiPin = this.form.value.upiPin;
    console.log("this.form.value.upiPin ", this.form.value.upiPin);
    console.log("this.payerUpiAccount ", this.payerUpiAccount);
    console.log("transfer amount details this.paymentTransferModel ", this.paymentTransferModel.payerAccount);

    this.upiAccountService.authenticateUPIPin(this.paymentTransferModel.payerAccount)
    .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((upiAccount: UPIAccountModel) => {
      console.log("Payer upi account Details for PIN verification: ", upiAccount);
      this.doTransferPayment();
    }, (err: any) => {
      this.spinner.hide();
      console.log("Failed to load registered accounts due to :", err);
      this.toastService.openSnackBar('Provided UPI PIN is invalid!', 'Try again', '.red-snackbar');
    });
  }

  doTransferPayment() {
    this.upiAccountService.paymentTransfer(this.paymentTransferModel)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((upiAccount: any) => {
        console.log("payment transfer response --->>>", upiAccount);
        this.spinner.hide();
        this.rrn = upiAccount;
        this.dateTime = this.getCurrentDateTime();
        this.shouldShowUPITransferScreen = false;
        this.enableUPITransferButton = false;
        this.shouldShowPayeeUPIScreen = false;
        this.shouldShowUPIPaymentScreen = true;
      }, (err: any) => {
        this.spinner.hide();
        console.log("Failed to transfer amount due to :", err);
        this.toastService.openSnackBar('Payment Transfer Failed!', 'Try again', '.red-snackbar');
      });
  }

  loadPayeeUPIAccount() {
    this.upiAccountService.loadUPIAccountByVpa(this.form.value.payeeUpiId)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((payeeUpiAccount: UPIAccountModel) => {
        console.log("payeeUpiAccount loaded  : ", payeeUpiAccount);
        this.payeeUpiAccount = payeeUpiAccount;
        this.enableUPITransferButton = true;
      }, (err: any) => {
        console.log("Failed to load registered accounts due to :", err);
        this.toastService.openSnackBar('Payee UPI ID is invalid or not available!', 'Try again', '.red-snackbar');
      });
  }

  getCurrentDateTime() {
    let date: Date = new Date();
    let ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    let currentDateTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} | ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()} ${ampm}`;
    return currentDateTime;
  }

  close() {
    this.dialogRef.close();
  }
}