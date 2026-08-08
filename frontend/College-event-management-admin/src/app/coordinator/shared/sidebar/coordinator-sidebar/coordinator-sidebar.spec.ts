import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorSidebar } from './coordinator-sidebar';

describe('CoordinatorSidebar', () => {
  let component: CoordinatorSidebar;
  let fixture: ComponentFixture<CoordinatorSidebar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorSidebar],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorSidebar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
