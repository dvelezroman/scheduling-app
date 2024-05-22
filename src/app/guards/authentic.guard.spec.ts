import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authenticGuard } from './authentic.guard';

describe('authenticGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authenticGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
