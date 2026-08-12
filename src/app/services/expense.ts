import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  //ADD Expense
  addExpense(expense: any) {
    return this.http.post<any>(
      this.apiUrl,
      expense
    );
  }

  //GET Expense
  getExpenses() {
    return this.http.get<any>(
      this.apiUrl
    );
  }

  //UPDATE Expense
  updateExpense(id: string, expense: any) {
    return this.http.put<any>(
      `${this.apiUrl}/${id}`,
      expense
    );
  }

  //DELETE Expense
  deleteExpense(id: string) {
    return this.http.delete<any>(
      `${this.apiUrl}/${id}`
    );
  }

  //GET Expense Summary
  getExpenseSummary() {

    return this.http.get<any>(
      `${this.apiUrl}/summary`
    );
  
  }

  //Import Expense
  importExpenses(expenses: any[]) {

    return this.http.post<any>(
      `${this.apiUrl}/import`,
      {
        expenses: expenses
      }
    );

  }

}