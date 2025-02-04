import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MobileSlotsDialogComponent } from '../mobile-slots-dialog/mobile-slots-dialog.component';
import { MobileService } from 'src/app/services/mobile-registration.service';
import { ToastService } from 'src/app/services/toast.service';
import { takeUntil } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-mobile-slots',
  templateUrl: './mobile-slots.component.html',
  styleUrls: ['./mobile-slots.component.scss']
})

export class MobileSlotsComponent extends BaseComponent implements OnInit {
  currentDevice: any;
  primaryMobile: any;
  isLoading: Boolean = true;
  isSecondDeviceAvailable: Boolean = false;

  constructor(public dialog: MatDialog, private mobileService: MobileService, private toastService: ToastService) {
    super();
    this.primaryMobile = JSON.parse(localStorage.getItem('currentDevice')!).primaryMobile;
  };

  ngOnInit() {
    this.loadDeviceDetails();
  };

  loadDeviceDetails(): void {
    this.mobileService.checkMobileExisting(this.primaryMobile).pipe(takeUntil(this.unsubscribe)).subscribe((device: any) => {
      if (device != null) {
        localStorage.removeItem('currentDevice');
        localStorage.setItem('currentDevice', JSON.stringify(device));
        this.currentDevice = device;
        this.isLoading = false;
        this.isSecondDeviceAvailable = !!this.currentDevice.secondaryMobile;
      }
    }, (err: any) => {
      console.log("fail to fetch device ---", err);
    });
  };

  openDialog(): void {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;
    const dialogRef = this.dialog.open(MobileSlotsDialogComponent, dialofConfig);
    dialogRef.afterClosed().subscribe(form => {
      if (form) {
        this.loadDeviceDetails();
      }
    });
  }
}

