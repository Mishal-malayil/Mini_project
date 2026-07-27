import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/logout`, {});
  }

  // Store token
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Check login
  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  // Remove token
  removeToken(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('admin');
}

  // Store admin
  saveAdmin(admin: any): void {
    localStorage.setItem('admin', JSON.stringify(admin));
  }

  // Get admin
  getAdmin(): any {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }

  // Remove admin
  removeAdmin(): void {
    localStorage.removeItem('admin');
  }
}