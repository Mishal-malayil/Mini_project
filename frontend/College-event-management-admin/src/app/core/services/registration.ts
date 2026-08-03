import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {

  private apiUrl = environment.apiUrl + '/registrations';

  constructor(private http: HttpClient) { }

  // Get All Registrations
  getRegistrations(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Get Single Registration
  getRegistration(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

}