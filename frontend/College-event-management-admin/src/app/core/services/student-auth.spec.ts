import { TestBed } from '@angular/core/testing';

import { StudentAuth } from './student-auth';

describe('StudentAuth', () => {
  let service: StudentAuth;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentAuth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
