import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentAuthService {

  private apiUrl = environment.apiUrl + '/student';

  constructor(private http: HttpClient) {}

  register(data: any) {
    return this.http.post(`${this.apiUrl}/register`, data);
  }

  login(data: any) {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  getProfile() {
    return this.http.get(`${this.apiUrl}/profile`);
  }
}