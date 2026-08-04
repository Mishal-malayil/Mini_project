import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../core/services/result';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results implements OnInit {

  results: any[] = [];
  filteredResults: any[] = [];

  selectedResult: any = {};

  constructor(private resultService: ResultService, private searchService: SearchService) {}

  ngOnInit(): void {

    this.loadResults();
    this.searchService.search$.subscribe(text => {

    console.log("Search:", text);

    this.filteredResults = this.results.filter(result =>

      result.registration?.student?.name
        ?.toLowerCase()
        .includes(text.toLowerCase()) ||

      result.registration?.event?.event_name
        ?.toLowerCase()
        .includes(text.toLowerCase()) ||

      result.position
        ?.toLowerCase()
        .includes(text.toLowerCase()) ||

      result.remarks
        ?.toLowerCase()
        .includes(text.toLowerCase())

    );

  });


  }

  loadResults() {

    this.resultService.getResults().subscribe({

      next: (res: any) => {

        this.results = res;
        this.filteredResults = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  viewResult(id: number) {

    this.resultService.getResult(id).subscribe({

      next: (res: any) => {

        this.selectedResult = res;

      }

    });

  }

}