import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSideNavBarComponent } from './admin-side-nav-bar.component';

describe('AdminSideNavBarComponent', () => {
  let component: AdminSideNavBarComponent;
  let fixture: ComponentFixture<AdminSideNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminSideNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
