import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpiPaymentDialogComponent } from './upi-payment-dialog.component';

describe('UpiPaymentDialogComponent', () => {
  let component: UpiPaymentDialogComponent;
  let fixture: ComponentFixture<UpiPaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpiPaymentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpiPaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
