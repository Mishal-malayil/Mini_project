import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {

  private apiUrl = environment.apiUrl + '/coordinators';

  constructor(private http: HttpClient) { }

  getCoordinators(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCoordinator(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addCoordinator(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCoordinator(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteCoordinator(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}