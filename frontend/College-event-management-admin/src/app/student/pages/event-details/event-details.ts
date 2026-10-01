import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class EventDetails implements OnInit {

  event: any = null;

  loading = true;
  registering = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!id) {
      this.router.navigate(['/student/explore-events']);
      return;
    }

    this.loadEvent(id);
  }

  loadEvent(id: number): void {

  this.loading = true;

  this.eventService.getStudentEvent(id).subscribe({

    next: (response: any) => {

      console.log('Full Event Details Response:', response);

      this.event = response.event || response;

      console.log('Event:', this.event);
      console.log('Event Image:', this.event?.image);

      this.loading = false;
    },

    error: (error: any) => {

      console.error('Event Details Error:', error);

      this.loading = false;
    }

  });
}

register(): void {
  Swal.fire({
    title: 'Confirm Registration',
    text: `Are you sure you want to register for "${this.event.event_name}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Register',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  }).then((result) => {

    if (result.isConfirmed) {
      this.registering = true;

      this.eventService.registerStudentEvent(this.event.id).subscribe({
        next: (response: any) => {

          this.registering = false;

          // Update UI immediately
          this.event.is_registered = true;
          this.event.registration_status = 'Pending';

          Swal.fire({
            icon: 'success',
            title: 'Registration Submitted!',
            text: 'Your registration request has been sent to the coordinator.',
            confirmButtonColor: '#2563eb'
          });
        },

        error: (error) => {

          this.registering = false;

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text: error.error?.message || 'Unable to register for this event.',
            confirmButtonColor: '#dc2626'
          });
        }
      });
    }
  });
}

  getEventImage(): string {

  console.log('Event image:', this.event?.image);

  if (this.event?.image) {
    return this.event.image;
  }

  return 'assets/images/event-placeholder.jpg';
}
  

}