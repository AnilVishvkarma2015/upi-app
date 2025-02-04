import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankUpdateAccountDialogComponent } from './bank-update-account-dialog.component';

describe('BankUpdateAccountDialogComponent', () => {
  let component: BankUpdateAccountDialogComponent;
  let fixture: ComponentFixture<BankUpdateAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankUpdateAccountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankUpdateAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
