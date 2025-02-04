import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MobileRegistrationComponent } from './components/mobile/mobile-registration/mobile-registration.component';
import { MobileDashboardComponent } from './components/mobile/mobile-dashboard/mobile-dashboard.component';
import { BankDashboardComponent } from './components/bank/bank-dashboard/bank-dashboard.component';
import { BankAccountsComponent } from './components/bank/bank-accounts/bank-accounts.component';
import { BankTransactionsComponent } from './components/bank/bank-transactions/bank-transactions.component';
import { BankStatementComponent } from './components/bank/bank-statement/bank-statement.component';

const routes: Routes = [
  {
    path: 'mobile-registration',
    component: MobileRegistrationComponent
  },
  {
    path: 'mobile-dashboard',
    component: MobileDashboardComponent
  },
  {
    path: 'bank-dashboard',
    component: BankDashboardComponent
  },
  {
    path: 'bank-accounts',
    component: BankAccountsComponent
  },
  {
    path: 'bank-transactions',
    component: BankTransactionsComponent
  },
  {
    path: 'bank-statement',
    component: BankStatementComponent
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
