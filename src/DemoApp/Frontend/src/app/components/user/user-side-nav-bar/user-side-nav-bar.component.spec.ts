import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSideNavBarComponent } from './user-side-nav-bar.component';

describe('UserSideNavBarComponent', () => {
  let component: UserSideNavBarComponent;
  let fixture: ComponentFixture<UserSideNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserSideNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSideNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
