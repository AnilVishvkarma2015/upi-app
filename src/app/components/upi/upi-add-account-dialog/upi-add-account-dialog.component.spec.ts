import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpiAddAccountDialogComponent } from './upi-add-account-dialog.component';

describe('UpiAddAccountDialogComponent', () => {
  let component: UpiAddAccountDialogComponent;
  let fixture: ComponentFixture<UpiAddAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpiAddAccountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpiAddAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
