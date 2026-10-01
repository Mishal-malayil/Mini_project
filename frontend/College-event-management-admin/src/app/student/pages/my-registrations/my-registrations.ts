import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EventService } from '../../../core/services/event';
import { RegistrationService } from '../../../core/services/registration';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

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
    private eventService: EventService,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

loadRegistrations(): void {

  this.loading = true;

  this.registrationService.getStudentRegistrations().subscribe({

    next: (response: any) => {

      console.log('My Registrations:', response);

      this.registrations = response.registrations || [];

      this.loading = false;

    },

    error: (error) => {

      console.error('My Registrations Error:', error);

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
cancelRegistration(registration: any): void {

  Swal.fire({
    title: 'Cancel Registration?',
    text: `Are you sure you want to cancel "${registration.event_name}"?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, Cancel',
    cancelButtonText: 'Keep Registration',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  }).then((result) => {

    if (result.isConfirmed) {

      this.registrationService
        .deleteStudentRegistration(registration.id)
        .subscribe({
          next: (response: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Registration Cancelled',
              text: response.message,
              confirmButtonColor: '#2563eb'
            });

            // Remove it immediately from the displayed list
            this.registrations = this.registrations.filter(
              item => item.id !== registration.id
            );
          },

          error: (error) => {

            Swal.fire({
              icon: 'error',
              title: 'Unable to Cancel',
              text: error.error?.message || 'Something went wrong.',
              confirmButtonColor: '#dc2626'
            });

          }
        });
    }
  });
}
}

