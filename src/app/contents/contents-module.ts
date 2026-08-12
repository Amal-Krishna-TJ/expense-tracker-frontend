import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentsRoutingModule } from './contents-routing-module';
import { Dashboard } from './dashboard/dashboard';
import { About } from './about/about';
import { Navbar } from '../others/navbar/navbar';
import { Contact } from './contact/contact';
import { ExpenseSummary } from './expense-summary/expense-summary';
import { MonthlyExpense } from './monthly-expense/monthly-expense';
import { AddExpense } from './add-expense/add-expense';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { RecurringExpense } from './recurring-expense/recurring-expense';
import { RecurringHistory } from './recurring-history/recurring-history';
import { Budget } from './budget/budget';
import { Reports } from './reports/reports';
import { Pagination } from '../shared/pagination/pagination';
import { EmptyState } from '../shared/empty-state/empty-state';


@NgModule({
  declarations: [
    Dashboard,
    About,
    Contact,
    ExpenseSummary,
    MonthlyExpense,
    AddExpense,
    RecurringExpense,
    RecurringHistory,
    Budget,
    Reports
  ],
  imports: [
    CommonModule,
    ContentsRoutingModule,
    Navbar,
    FormsModule,
    BaseChartDirective,
    ReactiveFormsModule,
    Pagination,
    EmptyState
]
})
export class ContentsModule { }
