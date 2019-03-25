import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDevDisplayComponent } from './all-dev-display.component';

describe('AllDevDisplayComponent', () => {
  let component: AllDevDisplayComponent;
  let fixture: ComponentFixture<AllDevDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDevDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDevDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
