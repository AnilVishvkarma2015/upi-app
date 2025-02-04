import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
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
  selector: 'app-upi-add-account-dialog',
  templateUrl: './upi-add-account-dialog.component.html',
  styleUrls: ['./upi-add-account-dialog.component.scss']
})
export class UpiAddAccountDialogComponent extends BaseComponent {
  public timeInterval: Subscription;
  public isLoading: Boolean = false;

  public shouldShowBankOptions: Boolean = true;
  public shouldShowSimSlotsOptions: Boolean = false;

  public shouldStartSmsSending: Boolean = false;
  public isSmsSent: Boolean = false;

  public shouldStartMobileVerification: Boolean = false;
  public isMobileVerified: Boolean = false;

  public shouldStartLoadingBankAccounts: Boolean = false;
  public isBankAccountsLoaded: Boolean = false;
  public showFetchedBankAccounts: Boolean = false;

  public enableCardVerifierButton: Boolean = false;
  public shouldShowCardVerifierScreen: Boolean = false;

  public enableOtpVerifierButton: Boolean = false;
  public shouldShowOtpVerifierScreen: Boolean = false;

  public enableUPIPinButton: Boolean = false;
  public shouldShowUPIPinScreen: Boolean = false;

  public shouldShowAccountAddedScreen: Boolean = false;
  public noBankAccountsFound: Boolean = false;
  public currentDevice: any;
  public form: FormGroup;
  public supportedBanks: Array<any> = new CommonUtils().loadSupportedBanks();
  public listAccounts: Array<any> = [];

  public upiRegisterForm: UPIAccountModel = {
    bankName: '',
    bankCode: '',
    bankBranch: '',
    accNum: '',
    accName: '',
    accIfsc: '',
    accType: '',
    mobileNo: '',
    vpa: '',
    upiPin: ''
  };

  constructor(private formBuilder: FormBuilder, private spinner: NgxSpinnerService, private dialogRef: MatDialogRef<UpiAddAccountDialogComponent>, private bankAccountService: BankAccountService, private upiAccountService: UPIAccountService, private toastService: ToastService) {
    super();
    this.spinner.hide();
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    this.form = this.formBuilder.group({
      bank: ['', Validators.required],
      selectedBank: [''],
      selectedSlot: [''],
      debitCardNo: ['', [Validators.required,
      Validators.minLength(6),
      Validators.maxLength(6),
      Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      debitCardExpiry: ['', [Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      debitCardPin: ['', [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      otp: ['', [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      upiPin: ['', [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      confirmUpiPin: ['', [Validators.required,
      Validators.minLength(4),
      Validators.maxLength(4), Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      selectedAccount: ['']
    });
  };

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  isCardFieldsInvalid(cardNo: string, cardExpiry: string) {
    return (this.form.controls[cardNo].invalid) || (this.form.controls[cardExpiry].invalid);
  }

  isOtpFieldsInvalid(debitCardPin: string, otp: string) {
    return (this.form.controls[debitCardPin].invalid) || (this.form.controls[otp].invalid);
  }

  isUPIPinFieldsInvalid(upiPin: string, confirmUpiPin: string) {
    return (this.form.controls[upiPin].invalid) || (this.form.controls[confirmUpiPin].invalid);
  }

  onBankSelection() {
    this.upiRegisterForm.bankName = this.form.value.bank.bankName;
    this.upiRegisterForm.bankCode = this.form.value.bank.bankCode;
    console.log("After Bank Selection : " + JSON.stringify(this.upiRegisterForm));
    this.shouldShowBankOptions = false;
    this.loadAllSimSlots();
  }

  loadAllSimSlots(): void {
    let primarySim = this.currentDevice.primaryMobile;
    let secondarySim = this.currentDevice.secondaryMobile;
    if (primarySim && secondarySim) {
      this.shouldShowSimSlotsOptions = !!secondarySim;
    } else {
      this.form.value.selectedSlot = primarySim;
      this.shouldShowBankOptions = false;
      this.onSimSelection();
    }
  }

  onSimSelection() {
    this.upiRegisterForm.mobileNo = this.form.value.selectedSlot;
    console.dir("After SIM Selection : " + JSON.stringify(this.upiRegisterForm));
    this.shouldStartSmsSending = !!this.upiRegisterForm.mobileNo;
    this.shouldShowSimSlotsOptions = !this.upiRegisterForm.mobileNo;
    this.setSmsSender();
  }

  setSmsSender() {
    setTimeout(() => {
      this.isSmsSent = true;
      this.shouldStartMobileVerification = true;
      this.setMobileVerifier();
    }, 1500);
  }

  setMobileVerifier() {
    setTimeout(() => {
      this.isMobileVerified = true;
      this.shouldStartLoadingBankAccounts = true;
      this.setFindBankAccounts();
    }, 1500);
  }

  setFindBankAccounts() {
    setTimeout(() => {
      this.loadBankAccountByMobile();
    }, 1000);
  }

  loadBankAccountByMobile() {
    let bankAccModel = {
      bankCode: this.upiRegisterForm.bankCode,
      mobileNo: this.upiRegisterForm.mobileNo
    };

    this.bankAccountService.loadBankAccountByMobile(bankAccModel)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((bankAccounts: BankAccountModel[]) => {
        console.log("bank account Details : ", bankAccounts);
        this.shouldStartSmsSending = false;
        this.shouldStartMobileVerification = false;
        this.shouldStartLoadingBankAccounts = false;
        if (bankAccounts && bankAccounts.length > 0) {
          this.listAccounts = bankAccounts;
          this.isBankAccountsLoaded = true;
          this.showFetchedBankAccounts = true;
          this.timeInterval.unsubscribe();
        } else {
          this.noBankAccountsFound = true;
        }
      }, (err: any) => {
        console.log("Failed to load registered accounts due to :", err);
      });
  }

  onAccountSelection() {
    this.upiRegisterForm.accIfsc = this.form.value.selectedAccount.accIfsc;
    this.upiRegisterForm.accNum = this.form.value.selectedAccount.accNum;
    this.upiRegisterForm.accType = this.form.value.selectedAccount.accType;
    this.upiRegisterForm.accName = this.form.value.selectedAccount.accName;
    this.upiRegisterForm.bankBranch = this.form.value.selectedAccount.bankBranch;
    console.dir("After Account Selection : " + JSON.stringify(this.upiRegisterForm));
    this.enableCardVerifierButton = !!this.upiRegisterForm.accNum;
  }

  onSubmit() {
    this.dialogRef.close(this.form.value);
  }

  onNextCardVerifierScreen() {
    this.shouldShowCardVerifierScreen = true;
    this.showFetchedBankAccounts = false;
  }

  onNextOtpVerifierScreen() {
    let accDebitCardNo = this.form.value.selectedAccount.debitCardNo;
    accDebitCardNo = accDebitCardNo.substring((accDebitCardNo).length - 6);
    let accDebitCardExpiry = this.form.value.selectedAccount.debitCardExpiry;

    if ((this.form.value.debitCardNo == accDebitCardNo) && this.form.value.debitCardExpiry == accDebitCardExpiry) {
      this.sendOtpToAccountHolder();
      this.enableOtpVerifierButton = true;
      this.shouldShowOtpVerifierScreen = true;
      this.enableCardVerifierButton = false;
      this.shouldShowCardVerifierScreen = false;
    } else {
      console.log("debit card no is not corrected");
      this.toastService.openSnackBar('Provided Debit Card details are incorrect!', 'Try again', '.red-snackbar');
    }
  }

  onNextUPIPinScreen() {
    let accDebitCardPin = this.form.value.selectedAccount.debitCardPin;

    if ((this.form.value.debitCardPin != accDebitCardPin)) {
      console.log("debit card pin is not correct");
      this.toastService.openSnackBar('Provided Debit Card PIN is incorrect!', 'Try again', '.red-snackbar');
      return;
    }

    this.bankAccountService.loadBankAccountByNum(this.upiRegisterForm.accNum)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((bankAccount: BankAccountModel) => {
        console.log("bank account Details : ", bankAccount);
        if (this.form.value.otp == bankAccount.currentOtp) {
          this.enableOtpVerifierButton = false;
          this.shouldShowOtpVerifierScreen = false;
          this.enableUPIPinButton = true;
          this.shouldShowUPIPinScreen = true;
        } else {
          console.log("Mobile OTP is not correct");
          this.toastService.openSnackBar('Provided OTP is incorrect!', 'Try again', '.red-snackbar');
          return;
        }
      }, (err: any) => {
        console.log("Failed to load registered accounts due to :", err);
        this.toastService.openSnackBar('Cannot process this request now!', 'Try again', '.red-snackbar');
      });
  }

  onNextRegisterScreen() {
    if (this.form.value.upiPin != this.form.value.confirmUpiPin) {
      console.log("debit card pin is not correct");
      this.toastService.openSnackBar('UPI PIN & Confirm PIN are not same!', 'Try again', '.red-snackbar');
      return;
    }

    this.spinner.show();
    this.upiRegisterForm.upiPin = this.form.value.upiPin;
    this.upiRegisterForm.vpa = (this.upiRegisterForm.mobileNo) + ("@") + (this.upiRegisterForm.bankCode).toLowerCase();
    this.upiAccountService.addNewUPIAccount(this.upiRegisterForm)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((upiAccount: UPIAccountModel) => {
        console.log("registered upi account Details : ", upiAccount);
        this.enableUPIPinButton = false;
        this.shouldShowUPIPinScreen = false;
        this.shouldShowAccountAddedScreen = true;
        this.spinner.hide();
      }, (err: any) => {
        console.log("Failed to load registered accounts due to :", err);
        this.toastService.openSnackBar('Cannot process this request now!', 'Try again', '.red-snackbar');
        this.spinner.hide();
      });
  }

  sendOtpToAccountHolder() {
    this.bankAccountService.sendOtpToAccountHolder(this.upiRegisterForm.accNum)
      .pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((bankAccount: BankAccountModel) => {
        console.log("bank account Details after otp: ", bankAccount);
      }, (err: any) => {
        console.log("Failed to load registered accounts due to :", err);
        this.toastService.openSnackBar('Cannot process this request now!', 'Try again', '.red-snackbar');
      });
  }

  close() {
    this.dialogRef.close();
  }
}
