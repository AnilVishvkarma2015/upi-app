import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast.service';
import { BaseComponent } from '../../base/base.component';
import { CommonUtils } from 'src/app/utils/common-utils.service';
import { BankAccountService } from 'src/app/services/bank-accounts.service';

@Component({
  selector: 'app-bank-add-account-dialog',
  templateUrl: './bank-add-account-dialog.component.html',
  styleUrls: ['./bank-add-account-dialog.component.scss']
})

export class BankAddAccountDialogComponent extends BaseComponent {
  form: FormGroup;
  currentBank: any;
  accountTypes: String[];
  bankBranches: String[];

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<BankAddAccountDialogComponent>, private bankService: BankAccountService, private toastService: ToastService) {
    super();
    this.currentBank = JSON.parse(localStorage.getItem('currentBank')!);
    this.accountTypes = new CommonUtils().loadAccountTypes();
    this.bankBranches = new CommonUtils().loadBankBranches();
    this.form = this.formBuilder.group({
      accName: ['', Validators.required],
      mobileNo: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      accType: ['', Validators.required],
      bankBranch: ['', Validators.required],
      netAmount: ['', Validators.required]
    });
  };

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  /*
  onSubmit() {
    this.form.value.bankCode = this.currentBank.bankCode;
    this.form.value.bankName = this.currentBank.bankName;
    this.form.value.accIfsc = new CommonUtils().loadBranchCodes(this.currentBank.bankCode, this.form.value.bankBranch);
    this.bankService.addNewAccount(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe((account: any) => {
      if (account == null || account.accNum == null) {
        this.toastService.openSnackBar('Account for ' + this.form.value.custName + ' is not created!', 'OK', '.red-snackbar');
      }
    }, (err: any) => {
      this.toastService.openSnackBar('Account opening failed!', 'Try again', '.red-snackbar');
    });
  }*/

  save() {
    this.form.value.bankCode = this.currentBank.bankCode;
    this.form.value.bankName = this.currentBank.bankName;
    this.form.value.accIfsc = new CommonUtils().loadBranchCodes(this.currentBank.bankCode, this.form.value.bankBranch);
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }
}
