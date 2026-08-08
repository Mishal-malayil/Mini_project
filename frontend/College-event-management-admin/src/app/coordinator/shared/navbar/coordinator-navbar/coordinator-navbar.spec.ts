import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorNavbar } from './coordinator-navbar';

describe('CoordinatorNavbar', () => {
  let component: CoordinatorNavbar;
  let fixture: ComponentFixture<CoordinatorNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorNavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorNavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
