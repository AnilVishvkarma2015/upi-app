import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HeaderService } from './header.service';
import { ToastService } from './toast.service';
import { BankAccountModel } from '../models/bank-accounts.model';

@Injectable({
    providedIn: 'root'
})
export class BankAccountService {
    apiBaseURL = "https://spring-boot-upi-meta-service.onrender.com";

    constructor(private http: HttpClient, private header: HeaderService, private toastService: ToastService) { }

    addNewAccount(newAccount: BankAccountModel): any {
        return this.http.post<BankAccountModel>(this.apiBaseURL + '/bank/account/register', newAccount, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    updateAccount(updatedAccount: BankAccountModel): any {
        console.log(updatedAccount)
        return this.http.patch<BankAccountModel>(this.apiBaseURL + '/bank/account/' + updatedAccount.id, updatedAccount, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    loadBankAccounts(bankCode: String) {
        return this.http.get<BankAccountModel[]>(this.apiBaseURL + '/bank/accounts/bankcode/' + bankCode, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    loadBankAccountByNum(accNum: String) {
        return this.http.get<BankAccountModel>(this.apiBaseURL + '/bank/account/accnum/' + accNum, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    sendOtpToAccountHolder(accNum: String) {
        return this.http.get<BankAccountModel>(this.apiBaseURL + '/bank/account/otp/' + accNum, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    loadBankAccountByMobile(loadAccount: any): any {
        return this.http.post<BankAccountModel[]>(this.apiBaseURL + '/bank/account/upi', loadAccount, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };
}
