import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private apiUrl = environment.apiUrl + '/students';

  constructor(private http: HttpClient) { }

  getStudents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getStudent(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addStudent(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateStudent(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}