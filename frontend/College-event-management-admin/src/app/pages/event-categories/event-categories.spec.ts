import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventCategories } from './event-categories';

describe('EventCategories', () => {
  let component: EventCategories;
  let fixture: ComponentFixture<EventCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventCategories],
    }).compileComponents();

    fixture = TestBed.createComponent(EventCategories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
