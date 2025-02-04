import { Component, ViewChild } from '@angular/core';
import { first, finalize, takeUntil } from 'rxjs/operators';
import { ToastService } from '../../../services/toast.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog, MatDialogConfig, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { BankAccountModel } from 'src/app/models/bank-accounts.model';
import { BankAccountService } from 'src/app/services/bank-accounts.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { BankAddAccountDialogComponent } from '../bank-add-account-dialog/bank-add-account-dialog.component';
import { BaseComponent } from '../../base/base.component';
import { BankUpdateAccountDialogComponent } from '../bank-update-account-dialog/bank-update-account-dialog.component';
import { CommonUtils } from 'src/app/utils/common-utils.service';

@Component({
  selector: 'app-bank-accounts',
  templateUrl: './bank-accounts.component.html',
  styleUrls: ['./bank-accounts.component.scss']
})
export class BankAccountsComponent extends BaseComponent {
  displayedColumns = ['accName', 'accNum', 'accType', 'accIfsc', 'mobileNo', 'bankBranch', 'actions'];
  dataSource: MatTableDataSource<BankAccountModel>;
  BankAccountModel: BankAccountModel[] = [];
  public isAccountFound: Boolean = true;
  currentBank: any;
  bankCode: String = "";
  isLoading = true;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private bankAccountService: BankAccountService, private exportPdfService: ExportPdfService, private toastService: ToastService) {
    super();
    this.currentBank = JSON.parse(localStorage.getItem('currentBank')!);
    this.bankCode = this.currentBank.bankCode;
  }

  ngOnInit() {
    this.loadBankAccounts();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private loadBankAccounts() {
    this.bankAccountService.loadBankAccounts(this.bankCode).pipe(
      finalize(() => this.isLoading = false))
      .subscribe(accounts => {
        console.log("Bank Accounts : ", accounts);
        this.isAccountFound = accounts.length > 0;
        this.dataSource = new MatTableDataSource(accounts);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  addBankAccount() {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;

    const dialogRef = this.dialog.open(BankAddAccountDialogComponent, dialofConfig);

    dialogRef.afterClosed().subscribe(form => {
      this.bankAccountService.addNewAccount(form).pipe(takeUntil(this.unsubscribe)).subscribe((account: any) => {
        if (account == null || account.accNum == null) {
          this.toastService.openSnackBar('Account for ' + form.value.custName + ' is not created!', 'OK', '.red-snackbar');
        }
        this.loadBankAccounts();
      }, (err: any) => {
        this.toastService.openSnackBar('Account opening failed!', 'Try again', '.red-snackbar');
      });      
    });
  }

  updateAccount(updatedAccount: BankAccountModel) {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;

    dialofConfig.data = {
      id: updatedAccount.id,
      bankName: updatedAccount.bankName,
      bankCode: updatedAccount.bankCode,
      bankBranch: updatedAccount.bankBranch,
      accNum: updatedAccount.accNum,
      accName: updatedAccount.accName,
      accIfsc: updatedAccount.accIfsc,
      accType: updatedAccount.accType,
      mobileNo: updatedAccount.mobileNo,
      netAmount: updatedAccount.netAmount,
      debitCardExpiry: updatedAccount.debitCardExpiry,
      debitCardNo: updatedAccount.debitCardNo,
      debitCardPin: updatedAccount.debitCardPin
    };

    const dialogRef = this.dialog.open(BankUpdateAccountDialogComponent, dialofConfig);

    dialogRef.afterClosed().subscribe(form => {
      form.accIfsc = new CommonUtils().loadBranchCodes(form.bankCode,form.bankBranch);
      console.log("updated form ---", form)
      this.bankAccountService.updateAccount(form).pipe(takeUntil(this.unsubscribe)).subscribe((account: any) => {
        this.toastService.openSnackBar('Account updated successfully for: ' + account.accName + '!', 'OK', '.green-snackbar');
        this.loadBankAccounts();
      });
    });
  }

  downloadAccountPDF(updatedAccount: BankAccountModel) {
    let columns = ["TITLE", "DETAILS"];
    let itemName = "BANK ACCOUNT DETAILS";
    let fileName = (updatedAccount.accName).toUpperCase().concat(" BANK ACCOUNT DETAILS");
    let rows: any[] = [];
    rows.push(['Account Name', updatedAccount.accName]);
    rows.push(['Account Number', updatedAccount.accNum]);
    rows.push(['Account IFSC', updatedAccount.accIfsc]);
    rows.push(['Account Type', updatedAccount.accType]);
    rows.push(['Branch Name', updatedAccount.bankBranch]);
    rows.push(['Mobile No.', updatedAccount.mobileNo]);
    rows.push(['Debit Card No.', updatedAccount.debitCardNo]);
    rows.push(['Debit Card Expiry', updatedAccount.debitCardExpiry]);
    this.exportPdfService.exportAccountToPdf(columns, itemName, fileName, rows, this.currentBank);
  }

  downloadAccountsPDF() {
    let columns = ["NO", "NAME", "ACCOUNT NO", "ACCOUNT TYPE", "ACCOUNT IFSC", "MOBILE NO", "BANK BRANCH"];
    let rows: any[] = [];
    let itemName = "BANK ACCOUNTS REPORT";
    let counter = 1;

    this.bankAccountService.loadBankAccounts(this.bankCode).pipe(first()).subscribe(accounts => {
      for (var account of accounts) {
        let supplierArray = [
          counter++,
          account.accName,
          account.accNum,
          account.accType,
          account.accIfsc,
          account.mobileNo,
          account.bankBranch
        ];
        rows.push(supplierArray);
      }
      this.exportPdfService.exportAccountsToPdf(columns, rows, itemName, this.currentBank);
    })
  }
}
