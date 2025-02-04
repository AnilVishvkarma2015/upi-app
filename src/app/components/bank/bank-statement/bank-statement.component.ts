import { Component, OnInit, ViewChild } from '@angular/core';
import { first, finalize } from 'rxjs/operators';
import { ToastService } from '../../../services/toast.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { BaseComponent } from '../../base/base.component';
import { BankTransactionModel } from 'src/app/models/bank-transactions.model';
import { UPIAccountService } from 'src/app/services/upi-account.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bank-statement',
  templateUrl: './bank-statement.component.html',
  styleUrls: ['./bank-statement.component.scss']
})
export class BankStatementComponent extends BaseComponent implements OnInit {
  public displayedColumns = ['datetimeCreated', 'txnNarrative', 'txnRefNo', 'debit', 'credit', 'accBalance'];
  public dataSource: MatTableDataSource<BankTransactionModel>;
  public BankTransactionModel: BankTransactionModel[] = [];
  public form: FormGroup;
  public currentBank: any;
  public bankCode: String = "";
  public isLoading: Boolean = true;
  public isAccountFound: Boolean = false;
  public noAccountFound: Boolean = false;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private upiAccountService: UPIAccountService, private exportPdfService: ExportPdfService, private toastService: ToastService) {
    super();
    this.currentBank = JSON.parse(localStorage.getItem('currentBank')!);
    this.bankCode = this.currentBank.bankCode;
  }

  ngOnInit() {
    this.form = this.formBuilder.group({
      accNum: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(12),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onAccountSubmit() {
    this.loadBankStatement();
  }

  private loadBankStatement() {
    this.upiAccountService.bankStatement(this.form.value.accNum).pipe(
      finalize(() => this.isLoading = false))
      .subscribe(statementRecords => {
        if (statementRecords.length >= 1) {
          this.isAccountFound = true;
          this.noAccountFound = false;
          this.dataSource = new MatTableDataSource(statementRecords);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        } else {
          this.isAccountFound = false;
          this.noAccountFound = true;
        }
      }, err => {
        this.toastService.openSnackBar('Data Loading Error: ' + err.status + ' - ' + err.statusText, '', 'error-snackbar');
        throw err;
      });
  }


  downloadStatementPDF() {
    let columns = ["NO", "DATE TIME", "PARTICULARS", "REFERENCE NO", "DEBIT", "CREDIT", "BALANCE"];
    let rows: any[] = [];
    let itemName = "BANK STATEMENT";
    let counter = 1;
    let currentTxn: BankTransactionModel;

    this.upiAccountService.bankStatement(this.form.value.accNum).pipe(first()).subscribe(txns => {
      for (var txn of txns) {
        currentTxn = txn;
        let txnsArray = [
          counter++,
          txn.datetimeCreated,
          txn.txnNarrative,
          txn.txnRefNo,
          txn.debit,
          txn.credit,
          txn.accBalance
        ];
        rows.push(txnsArray);
      }
      this.exportPdfService.exportStatementToPdf(columns, rows, itemName, currentTxn, this.currentBank);
    })
  }
}
