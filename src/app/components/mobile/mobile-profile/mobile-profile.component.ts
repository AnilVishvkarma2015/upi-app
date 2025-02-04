import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../../base/base.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MobileProfileDialogComponent } from '../mobile-profile-dialog/mobile-profile-dialog.component';

@Component({
  selector: 'app-mobile-profile',
  templateUrl: './mobile-profile.component.html',
  styleUrls: ['./mobile-profile.component.scss']
})
export class MobileProfileComponent extends BaseComponent implements OnInit {
  currentDevice: any;
  isLoading: Boolean = true;

  constructor(public dialog: MatDialog) {
    super();
    this.currentDevice = JSON.parse(localStorage.getItem('currentDevice')!);
  }

  ngOnInit() {};

  openDialog(): void {
    const dialofConfig = new MatDialogConfig();
    dialofConfig.disableClose = true;
    dialofConfig.autoFocus = true;
    const dialogRef = this.dialog.open(MobileProfileDialogComponent, dialofConfig);

    dialogRef.afterClosed().subscribe(form => {
      if (form) {
      
      }
    });
  };
}

