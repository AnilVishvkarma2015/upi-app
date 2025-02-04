import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppMaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UpiAccountsComponent } from './components/upi/upi-accounts/upi-accounts.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MobileRegistrationComponent } from './components/mobile/mobile-registration/mobile-registration.component';
import { MobileDashboardComponent } from './components/mobile/mobile-dashboard/mobile-dashboard.component';
import { MobileProfileComponent } from './components/mobile/mobile-profile/mobile-profile.component';
import { MobileProfileDialogComponent } from './components/mobile/mobile-profile-dialog/mobile-profile-dialog.component';
import { MobileSlotsComponent } from './components/mobile/mobile-slots/mobile-slots.component';
import { MobileSlotsDialogComponent } from './components/mobile/mobile-slots-dialog/mobile-slots-dialog.component';
import { BankDashboardComponent } from './components/bank/bank-dashboard/bank-dashboard.component';
import { BankAccountsComponent } from './components/bank/bank-accounts/bank-accounts.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BankAddAccountDialogComponent } from './components/bank/bank-add-account-dialog/bank-add-account-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { BankUpdateAccountDialogComponent } from './components/bank/bank-update-account-dialog/bank-update-account-dialog.component';
import { UpiAddAccountDialogComponent } from './components/upi/upi-add-account-dialog/upi-add-account-dialog.component';
import { UpiAccountBalanceDialogComponent } from './components/upi/upi-account-balance-dialog/upi-account-balance-dialog.component';
import { UpiPaymentDialogComponent } from './components/upi/upi-payment-dialog/upi-payment-dialog.component';
import { BankTransactionsComponent } from './components/bank/bank-transactions/bank-transactions.component';
import { BankStatementComponent } from './components/bank/bank-statement/bank-statement.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    MobileRegistrationComponent,
    MobileDashboardComponent,
    MobileProfileComponent,
    MobileProfileDialogComponent,
    MobileSlotsComponent,
    MobileSlotsDialogComponent,
    BankDashboardComponent,
    BankAccountsComponent,
    BankTransactionsComponent,
    BankStatementComponent,
    BankAddAccountDialogComponent,
    BankUpdateAccountDialogComponent,
    UpiAccountsComponent,
    UpiAddAccountDialogComponent,
    UpiAccountBalanceDialogComponent,
    UpiPaymentDialogComponent
  ],
  imports: [
    AppMaterialModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatNativeDateModule,
    HttpClientModule,
    FlexLayoutModule,
    MatDialogModule,
    MatRadioModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    NgxSpinnerModule,
    NgxSpinnerModule.forRoot({ type: 'ball-scale-multiple' })
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [MobileProfileDialogComponent, MobileSlotsDialogComponent, BankAddAccountDialogComponent, BankUpdateAccountDialogComponent,
    UpiAddAccountDialogComponent, UpiAccountBalanceDialogComponent, UpiPaymentDialogComponent],
})
export class AppModule { }
