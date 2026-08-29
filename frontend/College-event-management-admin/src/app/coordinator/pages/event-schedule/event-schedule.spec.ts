import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchedule } from './event-schedule';

describe('EventSchedule', () => {
  let component: EventSchedule;
  let fixture: ComponentFixture<EventSchedule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventSchedule],
    }).compileComponents();

    fixture = TestBed.createComponent(EventSchedule);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
