import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  // =========================
  // ADMIN / GENERAL
  // =========================

  private apiUrl =
    `${environment.apiUrl}/announcements`;

  // =========================
  // COORDINATOR
  // =========================

  private coordinatorApiUrl =
    `${environment.apiUrl}/coordinator/announcements`;

  // =========================
  // STUDENT
  // =========================

  private studentApiUrl =
    `${environment.apiUrl}/student/notifications`;

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // ADMIN / GENERAL
  // =========================

  getAnnouncements(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getAnnouncement(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addAnnouncement(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  updateAnnouncement(
    id: number,
    data: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // COORDINATOR
  // =========================

  getCoordinatorAnnouncements(): Observable<any> {
    return this.http.get(
      this.coordinatorApiUrl
    );
  }

  getCoordinatorAnnouncement(
    id: number
  ): Observable<any> {
    return this.http.get(
      `${this.coordinatorApiUrl}/${id}`
    );
  }

  sendCoordinatorAnnouncement(
    data: any
  ): Observable<any> {
    return this.http.post(
      this.coordinatorApiUrl,
      data
    );
  }

  deleteCoordinatorAnnouncement(
    id: number
  ): Observable<any> {
    return this.http.delete(
      `${this.coordinatorApiUrl}/${id}`
    );
  }

  // =========================
  // STUDENT
  // =========================

  // Get all notifications
  getStudentNotifications(): Observable<any> {
    return this.http.get(
      this.studentApiUrl
    );
  }

  // Get unread notification count
  getStudentUnreadCount(): Observable<any> {
    return this.http.get(
      `${this.studentApiUrl}/unread-count`
    );
  }

  // Mark notifications as seen
  markStudentNotificationsAsSeen(): Observable<any> {
    return this.http.post(
      `${this.studentApiUrl}/mark-seen`,
      {}
    );
  }
}