import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

  apiUrl = environment.apiUrl + '/attendances';

  constructor(private http: HttpClient) { }

  getAttendance(){

    return this.http.get(this.apiUrl);

  }

  getSingleAttendance(id:number){

    return this.http.get(`${this.apiUrl}/${id}`);

  }

}