import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast.service';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-mobile-profile-dialog',
  templateUrl: './mobile-profile-dialog.component.html',
  styleUrls: ['./mobile-profile-dialog.component.scss']
})
export class MobileProfileDialogComponent extends BaseComponent {
  currentDevice: any;
  form: FormGroup;

  constructor(private formBuilder: FormBuilder, private dialogRef: MatDialogRef<MobileProfileDialogComponent>, private toastService: ToastService) {
    super();
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    console.log("-------------", this.currentDevice);
    this.form = this.formBuilder.group({
      customerName: [this.currentDevice.customerName, Validators.required],
      gender: [this.currentDevice.gender, Validators.required],
      dob: [this.currentDevice.dob, Validators.required],
      primaryMobile: [this.currentDevice.primaryMobile, Validators.required]
    });
    console.log("-------------",  this.form);
  };

  close() {
    this.dialogRef.close();
  }
}

