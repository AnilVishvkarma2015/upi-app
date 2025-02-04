import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankAddAccountDialogComponent } from './bank-add-account-dialog.component';

describe('BankAddAccountDialogComponent', () => {
  let component: BankAddAccountDialogComponent;
  let fixture: ComponentFixture<BankAddAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankAddAccountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankAddAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
