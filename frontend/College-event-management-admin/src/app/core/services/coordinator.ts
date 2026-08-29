import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CoordinatorService {

  // =====================================================
  // API URLs
  // =====================================================

  // Admin-side Coordinator CRUD
  private apiUrl = environment.apiUrl + '/coordinators';

  // Coordinator authentication
  private authUrl = environment.apiUrl + '/coordinator';

  constructor(private http: HttpClient) {}


  // =====================================================
  // COORDINATOR CRUD - ADMIN
  // =====================================================

  // Get all coordinators
  getCoordinators(): Observable<any> {

    return this.http.get(this.apiUrl);

  }


  // Get single coordinator
  getCoordinator(id: number): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // Add coordinator
  addCoordinator(data: any): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }


  // Update coordinator
  updateCoordinator(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );

  }


  // Delete coordinator
  deleteCoordinator(id: number): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================================
  // COORDINATOR AUTHENTICATION
  // =====================================================

  // Coordinator login
  login(data: any): Observable<any> {

    return this.http.post(
      `${this.authUrl}/login`,
      data
    );

  }


  // Coordinator logout API
  logoutApi(): Observable<any> {

    return this.http.post(
      `${this.authUrl}/logout`,
      {}
    );

  }


  // Get logged-in coordinator profile
  getProfile(): Observable<any> {

    return this.http.get(
      `${this.authUrl}/profile`
    );

  }


  // =====================================================
  // TOKEN MANAGEMENT
  // =====================================================

  // Save coordinator token
  saveToken(token: string): void {

    localStorage.setItem(
      'coordinator_token',
      token
    );

  }


  // Get coordinator token
  getToken(): string | null {

    return localStorage.getItem(
      'coordinator_token'
    );

  }


  // Remove coordinator token
  removeToken(): void {

    localStorage.removeItem(
      'coordinator_token'
    );

  }


  // =====================================================
  // COORDINATOR DATA
  // =====================================================

  // Save logged-in coordinator details
  saveCoordinator(coordinator: any): void {

    localStorage.setItem(
      'coordinator',
      JSON.stringify(coordinator)
    );

  }


  // Get logged-in coordinator details
  getCoordinatorData(): any {

    const coordinator =
      localStorage.getItem('coordinator');

    if (!coordinator) {

      return null;

    }

    try {

      return JSON.parse(coordinator);

    } catch (error) {

      console.error(
        'Invalid coordinator data:',
        error
      );

      return null;

    }

  }


  // Remove coordinator details
  removeCoordinator(): void {

    localStorage.removeItem(
      'coordinator'
    );

  }


  // =====================================================
  // COORDINATOR EVENT API
  // =====================================================

  // Get ONLY logged-in coordinator's events
  getCoordinatorEvents(): Observable<any> {

    return this.http.get(
      `${this.authUrl}/events`
    );

  }


  // Get ONLY one event belonging to logged-in coordinator
  getCoordinatorEvent(id: number): Observable<any> {

    return this.http.get(
      `${this.authUrl}/events/${id}`
    );

  }


  // Add event as coordinator
  addCoordinatorEvent(data: any): Observable<any> {

    return this.http.post(
      `${this.authUrl}/events`,
      data
    );

  }


  // Update ONLY coordinator's own event
  updateCoordinatorEvent(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.authUrl}/events/${id}`,
      data
    );

  }


  // Delete ONLY coordinator's own event
  deleteCoordinatorEvent(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.authUrl}/events/${id}`
    );

  }


  // =====================================================
  // LOGIN STATUS
  // =====================================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  // =====================================================
  // COMPLETE LOGOUT
  // =====================================================

  logout(): void {

    this.removeToken();

    this.removeCoordinator();

  }

}