import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecurringExpense } from './recurring-expense';

describe('RecurringExpense', () => {
  let component: RecurringExpense;
  let fixture: ComponentFixture<RecurringExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecurringExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecurringExpense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
