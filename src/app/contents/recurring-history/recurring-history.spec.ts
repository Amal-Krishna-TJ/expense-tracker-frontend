import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringHistory } from './recurring-history';

describe('RecurringHistory', () => {
  let component: RecurringHistory;
  let fixture: ComponentFixture<RecurringHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecurringHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringHistory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
