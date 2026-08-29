import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  // =====================================================
  // ADMIN REGISTRATION API
  // =====================================================

  private apiUrl =
    environment.apiUrl + '/registrations';


  // =====================================================
  // COORDINATOR REGISTRATION API
  // =====================================================

  private coordinatorApiUrl =
    environment.apiUrl + '/coordinator/registrations';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // ADMIN
  // =====================================================

  // Get All Registrations
  getRegistrations(): Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }


  // Get Single Registration
  getRegistration(id: number): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================================
  // COORDINATOR
  // =====================================================

  // Get ONLY registrations for coordinator's own events
  getCoordinatorRegistrations(): Observable<any> {

    return this.http.get(
      this.coordinatorApiUrl
    );

  }


  // Get ONE registration of coordinator's own event
  getCoordinatorRegistration(
    id: number
  ): Observable<any> {

    return this.http.get(
      `${this.coordinatorApiUrl}/${id}`
    );

  }


  // Approve registration
  approveCoordinatorRegistration(
    id: number
  ): Observable<any> {

    return this.http.put(
      `${this.coordinatorApiUrl}/${id}/approve`,
      {}
    );

  }


  // Reject registration
  rejectCoordinatorRegistration(
    id: number
  ): Observable<any> {

    return this.http.put(
      `${this.coordinatorApiUrl}/${id}/reject`,
      {}
    );

  }

}