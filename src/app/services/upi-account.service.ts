import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from './header.service';
import { ToastService } from './toast.service';
import { UPIAccountModel } from '../models/upi-account.model';
import { UPIPaymentModel } from '../models/upi-payment.model';
import { BankTransactionModel } from '../models/bank-transactions.model';

@Injectable({
    providedIn: 'root'
})
export class UPIAccountService {
    apiBaseURL = "https://spring-boot-upi-meta-service.onrender.com";

    constructor(private http: HttpClient, private header: HeaderService, private toastService: ToastService) { }

    addNewUPIAccount(newAccount: UPIAccountModel): any {
        return this.http.post<UPIAccountModel>(this.apiBaseURL + '/upi/account/register', newAccount, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    loadUPIAccountByMobile(mobileNo: String): any {
        return this.http.get<UPIAccountModel>(this.apiBaseURL + '/upi/account/mobile/' + mobileNo, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    loadUPIAccountByVpa(vpa: String) {
        return this.http.get<UPIAccountModel>(this.apiBaseURL + '/upi/account/vpa/' + vpa, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    authenticateUPIPin(validateVpa: UPIAccountModel) {
        return this.http.post<UPIAccountModel>(this.apiBaseURL + '/upi/account/authenticate', validateVpa, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    paymentTransfer(paymentTransfer: UPIPaymentModel) {
        return this.http.post<String>(this.apiBaseURL + '/upi/payment', paymentTransfer, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    bankTransactions(bankCode: String) {
        return this.http.get<BankTransactionModel[]>(this.apiBaseURL + '/upi/payment/bank/'+ bankCode, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };

    bankStatement(accNum: String) {
        return this.http.get<BankTransactionModel[]>(this.apiBaseURL + '/upi/payment/account/'+ accNum, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };
}
