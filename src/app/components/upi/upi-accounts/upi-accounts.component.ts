import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { UPIAccountService } from 'src/app/services/upi-account.service';
import { first, takeUntil} from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { UpiAddAccountDialogComponent } from '../upi-add-account-dialog/upi-add-account-dialog.component';
import { UpiAccountBalanceDialogComponent } from '../upi-account-balance-dialog/upi-account-balance-dialog.component';
import { UPIAccountModel } from 'src/app/models/upi-account.model';
import { UpiPaymentDialogComponent } from '../upi-payment-dialog/upi-payment-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upi-accounts',
  templateUrl: './upi-accounts.component.html',
  styleUrls: ['./upi-accounts.component.scss']
})
export class UpiAccountsComponent extends BaseComponent implements OnInit {
  currentDevice: any;
  isLoading: Boolean = true;
  upiAccount: UPIAccountModel;
  isUPIAccountAvailable: Boolean = false;
  upiAccounts: Array<any> = [];
  timeInterval: Subscription;
  trimmedUPIAccount: string;
  status: any;

  constructor(public dialog: MatDialog, private spinner: NgxSpinnerService, private upiAccountService: UPIAccountService) {
    super();
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    this.spinner.hide();
  };

  ngOnInit() {
    this.loadUPIAccounts();
  };

  loadUPIAccounts(): void {
    this.spinner.show();
    this.upiAccountService.loadUPIAccountByMobile(this.currentDevice.primaryMobile).pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((upiAccount1: any) => {
      if (upiAccount1) {
        this.spinner.hide();
        this.setUPIAccountDetails(upiAccount1);
      }
    }, (err: any) => {
      this.spinner.hide();
      if (err != null && err.status === 404) {
        this.upiAccountService.loadUPIAccountByMobile(this.currentDevice.secondaryMobile).pipe(first()).pipe(takeUntil(this.unsubscribe)).subscribe((upiAccount2: any) => {
          if (upiAccount2) {
            this.setUPIAccountDetails(upiAccount2);
          }
        }, (err: any) => {
          console.log("sim2 also account not found---", err);
        });
      }
    });
  }

  setUPIAccountDetails(upiAccount: any) {
    this.upiAccount = upiAccount;
    this.trimmedUPIAccount = upiAccount.accNum.substring((upiAccount.accNum).length - 4);
    let upiAccountArray = [upiAccount];
    this.isUPIAccountAvailable = upiAccountArray.length > 0;
    this.upiAccounts = upiAccountArray;
  }

  openAddAccountDialog(): void {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;
    const dialogRef = this.dialog.open(UpiAddAccountDialogComponent, dialofConfig);

    dialogRef.afterClosed().subscribe(form => {
      this.loadUPIAccounts();
    });
  };

  openBankBalanceDialog(): void {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;
    const dialogRef = this.dialog.open(UpiAccountBalanceDialogComponent, { data: this.upiAccount });

    dialogRef.afterClosed().subscribe(form => {
     // Nothing to do as of now
    });
  };

  openUPIPaymentDialog(): void {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;
    const dialogRef = this.dialog.open(UpiPaymentDialogComponent, { data: this.upiAccount });

    dialogRef.afterClosed().subscribe(form => {
     // Nothing to do as of now
    });
  };
}
