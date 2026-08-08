import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorLogin } from './coordinator-login';

describe('CoordinatorLogin', () => {
  let component: CoordinatorLogin;
  let fixture: ComponentFixture<CoordinatorLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
