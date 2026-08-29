import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/login`, data);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/logout`, {});
  }

  // SAVE ADMIN TOKEN
  saveToken(token: string): void {
    localStorage.setItem('admin_token', token);
  }

  // GET ADMIN TOKEN
  getToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  // CHECK ADMIN LOGIN
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  // REMOVE ADMIN TOKEN
  removeToken(): void {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
  }

  // SAVE ADMIN
  saveAdmin(admin: any): void {
    localStorage.setItem(
      'admin',
      JSON.stringify(admin)
    );
  }

  // GET ADMIN
  getAdmin(): any {
    const admin = localStorage.getItem('admin');

    return admin ? JSON.parse(admin) : null;
  }

  // REMOVE ADMIN
  removeAdmin(): void {
    localStorage.removeItem('admin');
  }
}