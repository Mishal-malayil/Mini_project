import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoordinatorEvent } from './coordinator-event';

describe('CoordinatorEvent', () => {
  let component: CoordinatorEvent;
  let fixture: ComponentFixture<CoordinatorEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CoordinatorEvent],
    }).compileComponents();

    fixture = TestBed.createComponent(CoordinatorEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
