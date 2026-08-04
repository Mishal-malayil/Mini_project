import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  apiUrl = environment.apiUrl + '/results';

  constructor(private http: HttpClient) {}

  getResults() {

    return this.http.get(this.apiUrl);

  }

  getResult(id:number) {

    return this.http.get(`${this.apiUrl}/${id}`);

  }

}