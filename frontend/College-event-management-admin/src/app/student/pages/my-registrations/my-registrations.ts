import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-my-registrations',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './my-registrations.html',
  styleUrl: './my-registrations.css'
})
export class MyRegistrations implements OnInit {

  registrations: any[] = [];
  loading = false;

  constructor(
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {

    this.loading = true;

    this.eventService.getStudentRegistrations().subscribe({

      next: (response: any) => {

        this.registrations =
          response.registrations || [];

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Failed to load registrations:',
          error
        );

        this.loading = false;
      }

    });
  }

  getEventImage(registration: any): string {

    return registration.image ||
      'assets/images/event-placeholder.jpg';
  }

  getStatusClass(status: string): string {

    switch (status) {

      case 'Approved':
        return 'approved';

      case 'Rejected':
        return 'rejected';

      case 'Pending':
      default:
        return 'pending';
    }
  }

}

