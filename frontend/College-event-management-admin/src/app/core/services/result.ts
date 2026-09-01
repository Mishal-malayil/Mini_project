import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  // =====================================================
  // ADMIN RESULT API
  // =====================================================

  apiUrl =
    environment.apiUrl + '/results';


  // =====================================================
  // COORDINATOR RESULT API
  // =====================================================

  coordinatorApiUrl =
    environment.apiUrl + '/coordinator/results';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // ADMIN
  // =====================================================

  // Get all results
  getResults() {

    return this.http.get(
      this.apiUrl
    );

  }


  // Get single result
  getResult(
    id: number
  ) {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================================
  // COORDINATOR
  // =====================================================

  // Get results for coordinator's own events
  getCoordinatorResults() {

    return this.http.get(
      this.coordinatorApiUrl
    );

  }


  // Get coordinator's own events
  getCoordinatorEvents() {

    return this.http.get(
      `${this.coordinatorApiUrl}/events`
    );

  }


  // Get approved participants for selected event
  getEventParticipants(
    eventId: number
  ) {

    return this.http.get(
      `${this.coordinatorApiUrl}/event/${eventId}/participants`
    );

  }


  // Create / publish result
 createCoordinatorResult(
  data: {
    event_id: number;
    student_id: number;
    position: string;
    remarks?: string | null;
  }
) {
  return this.http.post(
    this.coordinatorApiUrl,
    data
  );
}


  // Update coordinator result
 updateCoordinatorResult(
  id: number,
  data: {
    event_id: number;
    student_id: number;
    position: string;
    remarks?: string | null;
  }
) {
  return this.http.put(
    `${this.coordinatorApiUrl}/${id}`,
    data
  );
}


  // Delete coordinator result
  deleteCoordinatorResult(
    id: number
  ) {

    return this.http.delete(
      `${this.coordinatorApiUrl}/${id}`
    );

  }

}