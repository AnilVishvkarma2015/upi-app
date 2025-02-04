import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-dashboard',
  templateUrl: './mobile-dashboard.component.html',
  styleUrls: ['./mobile-dashboard.component.scss']
})
export class MobileDashboardComponent {
  currentDevice: any;

  constructor(private router: Router) {
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
    
    if(!this.currentDevice) {
      this.router.navigate(['/login']);
    }
  };
}
