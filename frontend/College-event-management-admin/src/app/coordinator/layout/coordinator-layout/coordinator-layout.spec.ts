import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorLayout } from './coordinator-layout';

describe('CoordinatorLayout', () => {
  let component: CoordinatorLayout;
  let fixture: ComponentFixture<CoordinatorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorLayout],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
