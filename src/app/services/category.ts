import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(
    private http: HttpClient
  ) {}

  //GET Categories
  getCategories() {

    return this.http.get<any>(
      this.apiUrl
    );

  }

  //ADD Categories
  addCategory(name: string) {

    return this.http.post<any>(
      this.apiUrl,
      {
        name: name
      }
    );

  }

}