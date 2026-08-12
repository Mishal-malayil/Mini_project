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

   // =====================================================
  // COORDINATOR
  // =====================================================

  // Get Event Categories
  getCategories(): Observable<any> {

    return this.http.get(
      environment.apiUrl + '/event-categories'
    );

  }


  // Get Coordinator's Events
  getCoordinatorEvents(): Observable<any> {

    return this.http.get(
      environment.apiUrl + '/coordinator/events'
    );

  }


  // Add Event as Coordinator
  addCoordinatorEvent(data: any): Observable<any> {

    return this.http.post(
      environment.apiUrl + '/coordinator/events',
      data
    );

  }

}