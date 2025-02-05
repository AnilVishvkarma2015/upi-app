import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from './header.service';
import { ToastService } from './toast.service';
import { MobileRegistration } from '../models/mobile-registration.model';
import { AppConfig } from '../config/app.config';

@Injectable({
    providedIn: 'root'
})
export class MobileService {
    apiBaseURL = "https://spring-boot-upi-meta-service.onrender.com";

    constructor(private http: HttpClient, private header: HeaderService, private toastService: ToastService) { }

    registerNewDevice(newDevice: MobileRegistration): any {
        return this.http.post<MobileRegistration>(this.apiBaseURL + '/mobile/register', newDevice, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }

    updateDevice(updatedDevice: MobileRegistration): any {
        return this.http.patch<MobileRegistration>(this.apiBaseURL + '/mobile/update', updatedDevice, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    }
    
    checkMobileExisting(mobileNo: String): any {
        return this.http.get(this.apiBaseURL +'/mobile/' + mobileNo, this.header.requestHeaders()).pipe(res => {
            return res;
        });
    };
}
