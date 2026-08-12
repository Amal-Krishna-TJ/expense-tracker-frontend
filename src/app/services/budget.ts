import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class BudgetService {
  private apiUrl = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) { }

  createBudget(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  getBudgets() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateBudget(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteBudget(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
