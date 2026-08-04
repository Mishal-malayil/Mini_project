import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {

  private apiUrl = `${environment.apiUrl}/announcements`;

  constructor(private http: HttpClient) { }

  // Get All Announcements
  getAnnouncements(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get Single Announcement
  getAnnouncement(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Add Announcement
  addAnnouncement(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // Update Announcement
  updateAnnouncement(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  // Delete Announcement
  deleteAnnouncement(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

}