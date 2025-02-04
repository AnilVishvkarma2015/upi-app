import { Component, Inject } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ValidationErrors, AbstractControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BankAccountModel } from 'src/app/models/bank-accounts.model';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CommonUtils } from 'src/app/utils/common-utils.service';
import { BaseComponent } from '../../base/base.component';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-bank-update-account-dialog',
  templateUrl: './bank-update-account-dialog.component.html',
  styleUrls: ['./bank-update-account-dialog.component.scss']
})
export class BankUpdateAccountDialogComponent extends BaseComponent {
  currentBank: any;
  form: FormGroup;
  id: string;
  bankName: string;
  bankCode: string;
  bankBranch: string;
  accNum: string;
  accName: string;
  accIfsc: string;
  accType: string;
  mobileNo: string;
  netAmount: string;
  debitCardNo: string;
  debitCardExpiry: string;
  debitCardPin: string;
  accountTypes: String[];
  bankBranches: String[];

  constructor(private formBuilder: FormBuilder, private exportPdfService: ExportPdfService, private dialogRef: MatDialogRef<BankUpdateAccountDialogComponent>, @Inject(MAT_DIALOG_DATA) public bankAccountModel: BankAccountModel) {
    super();
    this.currentBank = JSON.parse(localStorage.getItem('currentBank')!);
    this.accountTypes = new CommonUtils().loadAccountTypes();
    this.bankBranches = new CommonUtils().loadBankBranches();
    this.form = this.formBuilder.group({
      id: [bankAccountModel.id],
      bankName: [bankAccountModel.bankName],
      bankCode: [bankAccountModel.bankCode],
      bankBranch: [bankAccountModel.bankBranch, Validators.required],
      accNum: [bankAccountModel.accNum],
      accName: [bankAccountModel.accName, Validators.required],
      accIfsc: [bankAccountModel.accIfsc],
      accType: [bankAccountModel.accType, Validators.required],
      mobileNo: [bankAccountModel.mobileNo, [Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      netAmount: [bankAccountModel.netAmount],
      debitCardNo: [bankAccountModel.debitCardNo],
      debitCardExpiry: [bankAccountModel.debitCardExpiry],
      debitCardPin: [bankAccountModel.debitCardPin]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }


  update() {
    this.dialogRef.close(this.form.value);
  }

  close() {
    this.dialogRef.close();
  }

  downloadAccountPDF() {
    let columns = ["TITLE", "DETAILS"];
    let itemName = "BANK ACCOUNT DETAILS";
    let fileName = (this.form.value.accName).toUpperCase().concat(" BANK ACCOUNT DETAILS");
    let rows: any[] = [];
    rows.push(['Account Name', this.form.value.accName]);
    rows.push(['Account Number', this.form.value.accNum]);
    rows.push(['Account IFSC', this.form.value.accIfsc]);
    rows.push(['Account Type', this.form.value.accType]);
    rows.push(['Branch Name', this.form.value.bankBranch]);
    rows.push(['Mobile No.', this.form.value.mobileNo]);
    rows.push(['Debit Card No.', this.form.value.debitCardNo]);
    rows.push(['Debit Card Expiry', this.form.value.debitCardExpiry]);

    this.exportPdfService.exportAccountToPdf(columns, itemName, fileName, rows, this.currentBank);
  }
}
