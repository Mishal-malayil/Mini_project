import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventCategoryService {

  private apiUrl = environment.apiUrl + '/event-categories';

  constructor(private http: HttpClient) {}

  // Get All Categories
  getCategories(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get Single Category
  getCategory(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Add Category
  addCategory(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Update Category
  updateCategory(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete Category
  deleteCategory(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}