import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { EventService } from '../../../core/services/event';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event-schedule',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './event-schedule.html',
  styleUrl: './event-schedule.css'
})
export class EventSchedule implements OnInit {

  events: any[] = [];

  loading = false;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSchedule();
  }

  // =====================================================
  // LOAD EVENT SCHEDULE
  // =====================================================

  loadSchedule(): void {

    this.loading = true;

    this.eventService.getCoordinatorEvents().subscribe({

      next: (response: any) => {

        console.log('SCHEDULE RESPONSE:', response);

        if (Array.isArray(response)) {
          this.events = response;
        }

        else if (Array.isArray(response.data)) {
          this.events = response.data;
        }

        else {
          this.events = [];
        }

        // Sort events by date and start time
        this.events.sort((a, b) => {

          const dateA = new Date(
            `${a.event_date}T${a.start_time}`
          ).getTime();

          const dateB = new Date(
            `${b.event_date}T${b.start_time}`
          ).getTime();

          return dateA - dateB;
        });

        console.log('SORTED SCHEDULE:', this.events);

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Schedule loading error:',
          error
        );

        this.loading = false;

        if (error.status === 401) {

          Swal.fire({
            icon: 'warning',
            title: 'Session Expired',
            text: 'Please login again.',
            confirmButtonColor: '#2563EB'
          });

          this.router.navigate([
            '/coordinator/login'
          ]);

        }

      }

    });

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(date: string): string {

    if (!date) {
      return '-';
    }

    const eventDate = new Date(
      `${date}T00:00:00`
    );

    return eventDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =====================================================
  // FORMAT TIME
  // =====================================================

  formatTime(time: string): string {

    if (!time) {
      return '-';
    }

    const parts = time.split(':');

    let hour = Number(parts[0]);

    const minute = parts[1];

    const period = hour >= 12
      ? 'PM'
      : 'AM';

    hour = hour % 12;

    if (hour === 0) {
      hour = 12;
    }

    return `${hour}:${minute} ${period}`;

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(status: string): string {

    switch (status?.toLowerCase()) {

      case 'approved':
        return 'approved';

      case 'pending':
        return 'pending';

      case 'rejected':
        return 'rejected';

      default:
        return 'pending';

    }

  }

}