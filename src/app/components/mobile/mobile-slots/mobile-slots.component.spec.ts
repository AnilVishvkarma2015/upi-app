import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileSlotsComponent } from './mobile-slots.component';

describe('MobileSlotsComponent', () => {
  let component: MobileSlotsComponent;
  let fixture: ComponentFixture<MobileSlotsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileSlotsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
