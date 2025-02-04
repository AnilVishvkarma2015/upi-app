import { Component, ViewChild } from '@angular/core';
import { first, finalize } from 'rxjs/operators';
import { ToastService } from '../../../services/toast.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { BaseComponent } from '../../base/base.component';
import { BankTransactionModel } from 'src/app/models/bank-transactions.model';
import { UPIAccountService } from 'src/app/services/upi-account.service';

@Component({
  selector: 'app-bank-transactions',
  templateUrl: './bank-transactions.component.html',
  styleUrls: ['./bank-transactions.component.scss']
})
export class BankTransactionsComponent extends BaseComponent {
  displayedColumns = ['datetimeCreated', 'upiId', 'accNum', 'accName', 'accIfsc', 'debit', 'credit'];
  dataSource: MatTableDataSource<BankTransactionModel>;
  BankTransactionModel: BankTransactionModel[] = [];
  public isTransactionFound: Boolean = true;
  currentBank: any;
  bankCode: String = "";
  isLoading = true;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private upiAccountService: UPIAccountService, private exportPdfService: ExportPdfService, private toastService: ToastService) {
    super();
    this.currentBank = JSON.parse(localStorage.getItem('currentBank')!);
    this.bankCode = this.currentBank.bankCode;
  }

  ngOnInit() {
    this.loadBankTransactions();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private loadBankTransactions() {
    this.upiAccountService.bankTransactions(this.bankCode).pipe(
      finalize(() => this.isLoading = false))
      .subscribe(transactions => {
        this.isTransactionFound = transactions.length > 0;
        this.dataSource = new MatTableDataSource(transactions);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }

  downloadTransactionsPDF() {
    let columns = ["NO", "DATE TIME", "ACCOUNT NAME", "ACCOUNT NO", "ACCOUNT IFSC", "UPI ID", "DEBIT", "CREDIT"];
    let rows: any[] = [];
    let itemName = "BANK TRANSACTIONS";
    let counter = 1;

    this.upiAccountService.bankTransactions(this.bankCode).pipe(first()).subscribe(txns => {
      for (var txn of txns) {
        let txnsArray = [
          counter++,
          txn.datetimeCreated,
          txn.accName,
          txn.accNum,
          txn.accIfsc,
          txn.upiId,
          txn.debit,
          txn.credit
        ];
        rows.push(txnsArray);
      }
      this.exportPdfService.exportTransactionsToPdf(columns, rows, itemName, this.currentBank);
    })
  }
}
