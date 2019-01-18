import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTopNavBarComponent } from './user-top-nav-bar.component';

describe('UserTopNavBarComponent', () => {
  let component: UserTopNavBarComponent;
  let fixture: ComponentFixture<UserTopNavBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserTopNavBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTopNavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
