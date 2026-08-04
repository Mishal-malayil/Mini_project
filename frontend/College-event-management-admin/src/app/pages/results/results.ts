import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultService } from '../../core/services/result';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.html',
  styleUrl: './results.css'
})
export class Results implements OnInit {

  results: any[] = [];

  selectedResult: any = {};

  constructor(private resultService: ResultService) {}

  ngOnInit(): void {

    this.loadResults();

  }

  loadResults() {

    this.resultService.getResults().subscribe({

      next: (res: any) => {

        this.results = res;

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