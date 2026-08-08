import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {

  // Coordinator CRUD API
  private apiUrl = environment.apiUrl + '/coordinators';

  // Coordinator authentication API
  private authUrl = environment.apiUrl + '/coordinator';

  constructor(private http: HttpClient) {}

  // ===============================
  // COORDINATOR CRUD
  // ===============================

  getCoordinators(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCoordinator(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addCoordinator(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateCoordinator(
    id: number,
    data: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteCoordinator(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }


  // ===============================
  // COORDINATOR LOGIN
  // ===============================

  login(data: any): Observable<any> {

    return this.http.post(
      `${this.authUrl}/login`,
      data
    );

  }


  // ===============================
  // SAVE TOKEN
  // ===============================

  saveToken(token: string): void {

    localStorage.setItem(
      'coordinator_token',
      token
    );

  }


  // ===============================
  // GET TOKEN
  // ===============================

  getToken(): string | null {

    return localStorage.getItem(
      'coordinator_token'
    );

  }


  // ===============================
  // SAVE COORDINATOR
  // ===============================

  saveCoordinator(coordinator: any): void {

    localStorage.setItem(
      'coordinator',
      JSON.stringify(coordinator)
    );

  }


  // ===============================
  // GET COORDINATOR
  // ===============================

  getCoordinatorData(): any {

    return JSON.parse(
      localStorage.getItem('coordinator') || '{}'
    );

  }


  // ===============================
  // LOGOUT
  // ===============================

  logout(): void {

    localStorage.removeItem(
      'coordinator_token'
    );

    localStorage.removeItem(
      'coordinator'
    );

  }


  // ===============================
  // CHECK LOGIN
  // ===============================

  isLoggedIn(): boolean {

    return !!localStorage.getItem(
      'coordinator_token'
    );

  }

}