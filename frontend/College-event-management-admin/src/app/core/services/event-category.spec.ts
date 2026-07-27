import { TestBed } from '@angular/core/testing';

import { EventCategory } from './event-category';

describe('EventCategory', () => {
  let service: EventCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
