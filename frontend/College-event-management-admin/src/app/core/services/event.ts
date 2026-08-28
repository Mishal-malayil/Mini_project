import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = environment.apiUrl + '/events';

  constructor(private http: HttpClient) {}


  // =====================================================
  // ADMIN
  // =====================================================

  // Get All Events
  getEvents(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  // Get Single Event
  getEvent(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }


  // Approve Event
  approveEvent(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      status: 'Approved'
    });
  }


  // Reject Event
  rejectEvent(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, {
      status: 'Rejected'
    });
  }


  // Create Event - Admin
  createEvent(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }


  // =====================================================
  // COORDINATOR
  // =====================================================

  // Get Event Categories
  getCategories(): Observable<any> {

    return this.http.get(
      environment.apiUrl + '/event-categories'
    );

  }


  // Get ONLY logged-in Coordinator's Events
  getCoordinatorEvents(): Observable<any> {
  return this.http.get(
    environment.apiUrl + '/coordinator/events'
  );
}


  // Get ONE of logged-in Coordinator's Events
  getCoordinatorEvent(id: number): Observable<any> {

    return this.http.get(
      `${environment.apiUrl}/coordinator/events/${id}`
    );

  }


  // Add Event as Coordinator
  addCoordinatorEvent(data: any): Observable<any> {

    return this.http.post(
      environment.apiUrl + '/coordinator/events',
      data
    );

  }


  // Update Coordinator's Own Event
  updateCoordinatorEvent(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${environment.apiUrl}/coordinator/events/${id}`,
      data
    );

  }


  // Delete Coordinator's Own Event
  deleteCoordinatorEvent(id: number): Observable<any> {

    return this.http.delete(
      `${environment.apiUrl}/coordinator/events/${id}`
    );

  }

}