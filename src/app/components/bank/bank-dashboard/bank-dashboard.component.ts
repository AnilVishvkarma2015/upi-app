import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bank-dashboard',
  templateUrl: './bank-dashboard.component.html',
  styleUrls: ['./bank-dashboard.component.scss']
})
export class BankDashboardComponent {
  currentBank: any;

  constructor(private router: Router) {
    this.currentBank = JSON.parse(localStorage.getItem('currentBank')!);
    
    if(!this.currentBank) {
      this.router.navigate(['/login']);
    }
  };
}