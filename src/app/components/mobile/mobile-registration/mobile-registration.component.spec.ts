import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileRegistrationComponent } from './mobile-registration.component';

describe('MobileRegistrationComponent', () => {
  let component: MobileRegistrationComponent;
  let fixture: ComponentFixture<MobileRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileRegistrationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
