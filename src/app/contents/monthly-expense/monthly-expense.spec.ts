import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyExpense } from './monthly-expense';

describe('MonthlyExpense', () => {
  let component: MonthlyExpense;
  let fixture: ComponentFixture<MonthlyExpense>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MonthlyExpense]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MonthlyExpense);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
