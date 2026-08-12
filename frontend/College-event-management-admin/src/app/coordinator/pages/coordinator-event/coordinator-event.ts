import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CoordinatorService } from '../../../core/services/coordinator';
import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-coordinator-events',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './coordinator-event.html',
  styleUrls: ['./coordinator-event.css']
})
export class CoordinatorEvents implements OnInit {

  events: any[] = [];

  categories: any[] = [];

  loading = false;

  newEvent: any = {
    category_id: '',
    event_name: '',
    description: '',
    venue: '',
    event_date: '',
    start_time: '',
    end_time: '',
    max_participants: null
  };


  constructor(
    private coordinatorService: CoordinatorService,
    private eventService: EventService,
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadCategories();

    this.loadEvents();

  }


  // =====================================================
  // LOAD CATEGORIES
  // =====================================================

  loadCategories(): void {

    this.eventService.getCategories().subscribe({

      next: (response: any) => {

        this.categories = response;

      },

      error: (error) => {

        console.error('Category loading error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to load event categories.',
          confirmButtonColor: '#2563EB'
        });

      }

    });

  }


  // =====================================================
  // LOAD COORDINATOR EVENTS
  // =====================================================

  loadEvents(): void {

    this.eventService.getCoordinatorEvents().subscribe({

      next: (response: any) => {

        this.events = response;

      },

      error: (error) => {

        console.error('Event loading error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to load events.',
          confirmButtonColor: '#2563EB'
        });

      }

    });

  }


  // =====================================================
  // OPEN ADD EVENT MODAL
  // =====================================================

  openAddEventModal(): void {

    this.resetForm();

    const modalElement =
      document.getElementById('addEventModal');

    if (modalElement) {

      const bootstrap = (window as any).bootstrap;

      const modal =
        bootstrap.Modal.getOrCreateInstance(modalElement);

      modal.show();

    }

  }


  // =====================================================
  // ADD EVENT
  // =====================================================

  addEvent(form: NgForm): void {

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }


    this.loading = true;


    const eventData = {

      category_id: Number(this.newEvent.category_id),

      event_name: this.newEvent.event_name,

      description: this.newEvent.description || null,

      venue: this.newEvent.venue,

      event_date: this.newEvent.event_date,

      // Laravel expects H:i:s
      start_time: this.newEvent.start_time + ':00',

      end_time: this.newEvent.end_time + ':00',

      max_participants:
        Number(this.newEvent.max_participants)

    };


    this.eventService.addCoordinatorEvent(eventData).subscribe({

      next: (response: any) => {

        this.loading = false;


        // Close modal

        const modalElement =
          document.getElementById('addEventModal');

        if (modalElement) {

          const bootstrap = (window as any).bootstrap;

          const modal =
            bootstrap.Modal.getInstance(modalElement);

          modal?.hide();

        }


        // Reset form

        form.resetForm();

        this.resetForm();


        // Reload events

        this.loadEvents();


        // Success message

        Swal.fire({

          icon: 'success',

          title: 'Event Created!',

          text:
            response.message ||
            'Event submitted successfully. Waiting for admin approval.',

          confirmButtonColor: '#2563EB'

        });

      },


      error: (error) => {

        this.loading = false;

        console.error('Add event error:', error);


        let message =
          'Unable to create event.';


        // Laravel validation errors

        if (error.status === 422) {

          const errors = error.error?.errors;

          if (errors) {

            message = Object.values(errors)
              .flat()
              .join('\n');

          }

        }


        // Authentication error

        if (error.status === 401) {

          message =
            'Coordinator authentication failed. Please login again.';

        }


        Swal.fire({

          icon: 'error',

          title: 'Failed',

          text: message,

          confirmButtonColor: '#DC2626'

        });

      }

    });

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  resetForm(): void {

    this.newEvent = {

      category_id: '',

      event_name: '',

      description: '',

      venue: '',

      event_date: '',

      start_time: '',

      end_time: '',

      max_participants: null

    };

  }

}