import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevDisplayComponent } from './dev-display.component';

describe('DevDisplayComponent', () => {
  let component: DevDisplayComponent;
  let fixture: ComponentFixture<DevDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
