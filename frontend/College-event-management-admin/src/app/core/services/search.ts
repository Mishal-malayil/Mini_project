import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private searchText = new BehaviorSubject<string>('');

  search$ = this.searchText.asObservable();

  setSearch(text: string) {
    this.searchText.next(text);
  }

}