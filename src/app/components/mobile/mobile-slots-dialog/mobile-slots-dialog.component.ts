import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast.service';
import { BaseComponent } from '../../base/base.component';
import { first, takeUntil } from 'rxjs/operators';
import { MobileService } from 'src/app/services/mobile-registration.service';
import { CommonUtils } from 'src/app/utils/common-utils.service';

@Component({
  selector: 'app-mobile-slots-dialog',
  templateUrl: './mobile-slots-dialog.component.html',
  styleUrls: ['./mobile-slots-dialog.component.scss']
})

export class MobileSlotsDialogComponent extends BaseComponent {
  form: FormGroup;
  currentDevice: any;
  networkProviders: String[];

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<MobileSlotsDialogComponent>, private mobileService: MobileService, private toastService: ToastService) {
    super();
    this.networkProviders = new CommonUtils().loadNetworkProviders();
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    this.form = this.formBuilder.group({
      primaryMobile: this.currentDevice.primaryMobile,
      secondaryMobile: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      secondaryNetworkProvider: ['', Validators.required],
    });
  };

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.mobileService.checkMobileExisting(this.form.value.secondaryMobile).pipe(takeUntil(this.unsubscribe)).subscribe((device: any) => {
      if (device != null) {
        this.toastService.openSnackBar('Mobile ' + this.form.value.secondaryMobile + ' already registered!', 'OK', '.red-snackbar');
      }
    }, (err: any) => {
      if (err != null && err.status === 404) {
        console.log("Provided mobile is not registered currently, will try to register this request");
        this.mobileService.updateDevice(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
          this.dialogRef.close(this.form.value);
        }, (err: any) => {
          this.toastService.openSnackBar('Mobile registration failed!', 'Try again', '.red-snackbar');
        });
      }
    });
  }

  close() {
    this.dialogRef.close();
  }
}
