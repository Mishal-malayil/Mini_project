import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  // =====================================================
  // API URLs
  // =====================================================

  private apiUrl = environment.apiUrl + '/events';

  private coordinatorUrl =
    environment.apiUrl + '/coordinator/events';


  constructor(private http: HttpClient) {}


  // =====================================================
  // ADMIN EVENTS
  // =====================================================

  // Get all events
  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  // Get single event
  getEvent(id: number): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }


  // Create event - Admin
  createEvent(data: any): Observable<any> {
    return this.http.post(
      this.apiUrl,
      data
    );
  }


  // Approve event
  approveEvent(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        status: 'Approved'
      }
    );
  }


  // Reject event
  rejectEvent(id: number): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      {
        status: 'Rejected'
      }
    );
  }


  // =====================================================
  // EVENT CATEGORIES
  // =====================================================

  getCategories(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/event-categories`
    );
  }


  // =====================================================
  // COORDINATOR EVENTS
  // =====================================================

  // Get ONLY logged-in coordinator's events
  getCoordinatorEvents(): Observable<any> {

    return this.http.get(
      this.coordinatorUrl
    );

  }


  // Get ONE own event
  getCoordinatorEvent(id: number): Observable<any> {

    return this.http.get(
      `${this.coordinatorUrl}/${id}`
    );

  }


  // Create event as coordinator
  addCoordinatorEvent(data: any): Observable<any> {

    return this.http.post(
      this.coordinatorUrl,
      data
    );

  }


  // Update own event
  updateCoordinatorEvent(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.coordinatorUrl}/${id}`,
      data
    );

  }


  // Delete own event
  deleteCoordinatorEvent(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.coordinatorUrl}/${id}`
    );

  }

}