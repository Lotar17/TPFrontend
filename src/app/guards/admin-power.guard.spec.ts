import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { adminPowerGuard } from './admin-power.guard';

describe('adminPowerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminPowerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
