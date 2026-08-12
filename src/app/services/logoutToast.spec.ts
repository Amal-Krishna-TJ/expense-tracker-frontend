import { TestBed } from '@angular/core/testing';

import { LogoutToastService } from './logoutToast';

describe('LogoutToastService', () => {
  let service: LogoutToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogoutToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
