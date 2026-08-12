import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  private getHeaders() {

    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };

  }

  getDashboard() {

    return this.http.get<any>(
      `${this.apiUrl}/dashboard`,
      this.getHeaders()
    );

  }

  getUsers() {

    return this.http.get<any>(
      `${this.apiUrl}/users`,
      this.getHeaders()
    );

  }

  deleteUser(id: string) {

    return this.http.delete<any>(
      `${this.apiUrl}/users/${id}`,
      this.getHeaders()
    );

  }

  getAnalytics(){

    return this.http.get<any>(

        `${this.apiUrl}/analytics`,

        this.getHeaders()

    );

  }

}