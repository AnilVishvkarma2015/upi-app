import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSlotsDialogComponent } from './mobile-slots-dialog.component';

describe('MobileSlotsDialogComponent', () => {
  let component: MobileSlotsDialogComponent;
  let fixture: ComponentFixture<MobileSlotsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileSlotsDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileSlotsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
