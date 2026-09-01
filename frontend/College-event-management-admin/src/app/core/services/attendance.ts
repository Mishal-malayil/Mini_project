import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  // =====================================================
  // ADMIN ATTENDANCE API
  // =====================================================

  apiUrl =
    environment.apiUrl + '/attendances';


  // =====================================================
  // COORDINATOR ATTENDANCE API
  // =====================================================

  coordinatorApiUrl =
    environment.apiUrl + '/coordinator/attendance';


  constructor(
    private http: HttpClient
  ) {}


  // =====================================================
  // ADMIN
  // =====================================================

  getAttendance() {

    return this.http.get(
      this.apiUrl
    );

  }


  getSingleAttendance(
    id: number
  ) {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }


  // =====================================================
  // COORDINATOR EVENTS
  // =====================================================

  // Get ONLY logged-in coordinator's events
  getCoordinatorEvents() {

    return this.http.get(
      environment.apiUrl + '/coordinator/events'
    );

  }


  // =====================================================
  // COORDINATOR ATTENDANCE
  // =====================================================

  // Get coordinator attendance
  getCoordinatorAttendance() {

    return this.http.get(
      this.coordinatorApiUrl
    );

  }


  // Get approved participants for selected event
  getEventParticipants(
    eventId: number
  ) {

    return this.http.get(
      `${this.coordinatorApiUrl}/event/${eventId}`
    );

  }


  // Mark attendance
  markAttendance(
    data: {
      registration_id: number;
      attendance_date: string;
      status: 'Present' | 'Absent';
    }
  ) {

    return this.http.post(
      this.coordinatorApiUrl,
      data
    );

  }


  // View one attendance
  getCoordinatorSingleAttendance(
    id: number
  ) {

    return this.http.get(
      `${this.coordinatorApiUrl}/${id}`
    );

  }


  // Delete attendance
  deleteCoordinatorAttendance(
    id: number
  ) {

    return this.http.delete(
      `${this.coordinatorApiUrl}/${id}`
    );

  }

}