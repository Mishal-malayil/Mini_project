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

    if (!this.event) {
      return;
    }

    if (this.event.is_registered) {

      Swal.fire({
        icon: 'info',
        title: 'Already Registered',
        text: 'You have already registered for this event.'
      });

      return;
    }

    this.registering = true;

    this.eventService
      .registerStudentEvent(this.event.id)
      .subscribe({

        next: (response: any) => {

          this.registering = false;

          this.event.is_registered = true;
          this.event.registration_status = 'Registered';

          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text:
              response?.message ||
              'You have successfully registered for this event.',
            confirmButtonColor: '#2563EB'
          });

        },

        error: (error: any) => {

          this.registering = false;

          console.error(
            'Event Registration Error:',
            error
          );

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            text:
              error?.error?.message ||
              'Unable to register for this event.'
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