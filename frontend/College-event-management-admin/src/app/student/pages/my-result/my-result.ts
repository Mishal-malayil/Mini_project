import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { ResultService } from '../../../core/services/result';

@Component({
  selector: 'app-my-results',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './my-result.html',
  styleUrl: './my-result.css'
})
export class MyResults implements OnInit {

  results: any[] = [];

  loading = false;

  constructor(
    private resultService: ResultService
  ) {}

  ngOnInit(): void {
    this.loadResults();
  }

  loadResults(): void {

    this.loading = true;

    this.resultService.getStudentResults().subscribe({

      next: (response: any) => {

        console.log('MY RESULTS RESPONSE:', response);

        this.results = response.results || [];

        this.loading = false;
      },

      error: (error) => {

        console.error('MY RESULTS ERROR:', error);

        this.results = [];

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Results',
          text: error.error?.message || 'Something went wrong.',
          confirmButtonColor: '#2563eb'
        });
      }

    });
  }

  getPositionClass(position: string): string {

    switch (position) {

      case 'First':
        return 'first';

      case 'Second':
        return 'second';

      case 'Third':
        return 'third';

      case 'Participation':
        return 'participation';

      default:
        return '';
    }
  }

  getPositionIcon(position: string): string {

    switch (position) {

      case 'First':
        return 'bi-trophy-fill';

      case 'Second':
        return 'bi-award-fill';

      case 'Third':
        return 'bi-award';

      case 'Participation':
        return 'bi-check-circle-fill';

      default:
        return 'bi-award';
    }
  }

  getCategoryName(result: any): string {

    if (!result.category) {
      return 'Event';
    }

    return result.category.name || result.category.category_name || 'Event';
  }

  viewEvent(result: any): void {

    if (result.event_id) {
      window.location.href = `/student/event-details/${result.event_id}`;
    }
  }
}