import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTopNavBarComponent } from './admin-top-nav-bar.component';

describe('AdminTopNavBarComponent', () => {
  let component: AdminTopNavBarComponent;
  let fixture: ComponentFixture<AdminTopNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminTopNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminTopNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
