import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class RecurringExpenseService {

  private apiUrl = `${environment.apiUrl}/recurring-expenses`;

  constructor(
    private http: HttpClient
  ) {}

  getRecurringExpenses(): Observable<any> {

    return this.http.get(this.apiUrl);

  }

  addRecurringExpense(data:any): Observable<any>{

    return this.http.post(
      this.apiUrl,
      data
    );

  }

  updateRecurringExpense(id:string,data:any){

    return this.http.put(

      `${this.apiUrl}/${id}`,

      data

    );

  }

  deleteRecurringExpense(id:string){

    return this.http.delete(

      `${this.apiUrl}/${id}`

    );

  }

  toggleRecurringExpense(id:string){

    return this.http.patch(

        `${this.apiUrl}/${id}/toggle`,

        {}

    );

  }

  getRecurringHistory(): Observable<any> {

    return this.http.get<any[]>(`${this.apiUrl}/history`);

  }

}
