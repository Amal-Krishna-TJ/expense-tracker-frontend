import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Dashboard } from './dashboard/dashboard';
import { About } from './about/about';
import { Contact } from './contact/contact';
import { AddExpense } from './add-expense/add-expense';
import { ExpenseSummary } from './expense-summary/expense-summary';
import { MonthlyExpense } from './monthly-expense/monthly-expense';
import { authGuard } from '../guards/auth-guard';
import { RecurringExpense } from './recurring-expense/recurring-expense';
import { RecurringHistory } from './recurring-history/recurring-history';
import { Budget } from './budget/budget';
import { Reports } from './reports/reports';

const routes: Routes = [
  {path: 'home', component: Dashboard},
  {path: 'about', component: About, canActivate: [authGuard]},
  {path: 'contact', component: Contact},
  {path: 'addExpense', component: AddExpense, canActivate: [authGuard]},
  {path: 'expenseSummary', component: ExpenseSummary, canActivate: [authGuard]},
  {path: 'monthlyExpense', component: MonthlyExpense, canActivate: [authGuard]},
  {path: 'recurringExpense', component: RecurringExpense, canActivate: [authGuard]},
  {path: 'recurringHistory', component: RecurringHistory, canActivate: [authGuard]},
  {path: 'budget', component: Budget, canActivate: [authGuard]},
  {path: 'reports', component: Reports, canActivate: [authGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentsRoutingModule { }
