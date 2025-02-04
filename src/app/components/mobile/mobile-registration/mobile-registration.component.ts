import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, of as observableOf } from 'rxjs';
import { ToastService } from 'src/app/services/toast.service';
import { takeUntil } from 'rxjs/operators';
import { MobileService } from 'src/app/services/mobile-registration.service';
import { CommonUtils } from 'src/app/utils/common-utils.service';

@Component({
  selector: 'app-mobile-registration',
  templateUrl: './mobile-registration.component.html',
  styleUrls: ['./mobile-registration.component.scss']
})
export class MobileRegistrationComponent extends BaseComponent implements OnInit {
  public form: FormGroup;
  public genders: String[];
  public networkProviders: String[];
  public isNewForm: Observable<boolean>;
  public isAccountRegistered: Boolean = false;

  constructor(private mobileService: MobileService, private formBuilder: FormBuilder, private toastService: ToastService) {
    super();
    this.genders = new CommonUtils().loadGenders();
    this.networkProviders = new CommonUtils().loadNetworkProviders();
  }

  ngOnInit() {
    this.isNewForm = observableOf(true);
    this.form = this.formBuilder.group({
      customerName: ['', Validators.required],
      gender: ['', Validators.required],
      dob: ['', Validators.required],
      primaryMobile: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern(/^-?(0|[1-9]\d*)?$/)
      ]],
      primaryNetworkProvider: ['', Validators.required],
      isActive: [true]
    });
  }

  isFieldInvalid(field: string) {
    return (this.form.controls[field].invalid && (this.form.controls[field].dirty || this.form.controls[field].touched));
  }

  onSubmit() {
    this.mobileService.checkMobileExisting(this.form.value.primaryMobile).pipe(takeUntil(this.unsubscribe)).subscribe((user: any) => {
      if (user != null) {
        this.toastService.openSnackBar('Mobile ' + this.form.value.primaryMobile + ' is already registered!', 'OK', '.red-snackbar');
      }
    }, (err: any) => {
      if (err != null && err.status === 404) {
        console.log("Provided mobile is not registered currently, will try to register this request");
        this.mobileService.registerNewDevice(this.form.value).pipe(takeUntil(this.unsubscribe)).subscribe(() => {
          this.isNewForm = observableOf(false);
          this.isAccountRegistered = true;
        }, (err: any) => {
          console.log("New mobile registration failed due to: ", err);
          this.isNewForm = observableOf(false);
        });
      }
    });
  }
}
