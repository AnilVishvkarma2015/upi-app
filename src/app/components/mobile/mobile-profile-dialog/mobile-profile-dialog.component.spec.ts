import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileProfileDialogComponent } from './mobile-profile-dialog.component';

describe('MobileProfileDialogComponent', () => {
  let component: MobileProfileDialogComponent;
  let fixture: ComponentFixture<MobileProfileDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MobileProfileDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MobileProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
