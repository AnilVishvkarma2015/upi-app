import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpiAccountBalanceDialogComponent } from './upi-account-balance-dialog.component';

describe('UpiAccountBalanceDialogComponent', () => {
  let component: UpiAccountBalanceDialogComponent;
  let fixture: ComponentFixture<UpiAccountBalanceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpiAccountBalanceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpiAccountBalanceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
