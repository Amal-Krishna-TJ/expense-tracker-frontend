import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  getProfile() {

    const token = localStorage.getItem('token');

    return this.http.get<any>(

      `${this.apiUrl}/me`,

      {

        headers: new HttpHeaders({

          Authorization: `Bearer ${token}`

        })

      }

    );

  }

  updateProfile(profile:any) {

    const token = localStorage.getItem('token');

    return this.http.put<any>(

      `${this.apiUrl}/profile`,

      profile,

      {

        headers: new HttpHeaders({

          Authorization: `Bearer ${token}`

        })

      }

    );

  }

}