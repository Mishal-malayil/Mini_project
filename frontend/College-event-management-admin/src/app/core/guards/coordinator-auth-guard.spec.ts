import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { coordinatorAuthGuard } from './coordinator-auth-guard';

describe('coordinatorAuthGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => coordinatorAuthGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
