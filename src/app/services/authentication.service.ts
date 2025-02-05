import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppConfig } from '../config/app.config';
import { ToastService } from './toast.service';
import { MobileRegistration } from '../models/mobile-registration.model';
import { BankModel } from '../models/bank.model';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {
    isLoginAuthenticated = new BehaviorSubject<boolean>(this.hasToken());
    isBankAuthenticated = new BehaviorSubject<boolean>(this.hasBankToken());
    apiBaseURL = "https://spring-boot-upi-meta-service.onrender.com";
    
    constructor(private http: HttpClient, private router: Router, private toastService: ToastService) {

    }

    private hasToken(): boolean {
        return !!localStorage.getItem('currentDevice') || !!localStorage.getItem('currentBank');
    }

    private hasBankToken(): boolean {
        return !!localStorage.getItem('currentBank');
    }

    isLoggedIn(): Observable<boolean> {
        return this.isLoginAuthenticated.asObservable();
    }

    isBank(): Observable<boolean> {
        return this.isBankAuthenticated.asObservable();
    }

    deviceLogin(mobileLogin: MobileRegistration) {
        return this.http.post<any>(this.apiBaseURL + '/mobile/authenticate', mobileLogin)
            .pipe(map(device => {
                if (device && device.primaryMobile) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentDevice', JSON.stringify(device));
                    this.isLoginAuthenticated.next(true);
                }

                return device;
            }));
    }

    bankLogin(bankLogin: BankModel) {
        return this.http.post<any>(this.apiBaseURL + '/bank/authenticate', bankLogin)
            .pipe(map(bank => {
                if (bank && bank.bankCode) {
                    // store bank details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentBank', JSON.stringify(bank));
                    this.isLoginAuthenticated.next(true);
                    this.isBankAuthenticated.next(true);
                }

                return bank;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentDevice');
        localStorage.removeItem('currentBank');
        this.isLoginAuthenticated.next(false);
        this.isBankAuthenticated.next(false);
        this.router.navigate(['/login']);
        this.toastService.openSnackBar('You have been Logout Successfully!', '', 'success-snackbar');
    }
}