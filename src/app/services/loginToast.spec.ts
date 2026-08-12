import { TestBed } from '@angular/core/testing';

import { LoginToastService } from './loginToast';

describe('LoginToast', () => {
  let service: LoginToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
