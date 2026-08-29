import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

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


  // =====================================================
  // EVENTS & CATEGORIES
  // =====================================================

  events: any[] = [];

  categories: any[] = [];

  loading = false;


  // =====================================================
  // ADD EVENT FORM
  // =====================================================

  newEvent: any = {

    category_id: '',

    event_name: '',

    description: '',

    venue: '',

    event_date: '',

    start_time: '',
    start_time_display: '',

    end_time: '',
    end_time_display: '',

    max_participants: null

  };


  // =====================================================
  // CUSTOM TIME PICKER
  // =====================================================

  activeTimePicker: 'start' | 'end' | null = null;

  timePickerHour: number = 12;

  timePickerMinute: number = 0;

  timePickerPeriod: 'AM' | 'PM' = 'AM';


  hours: number[] = [
    1, 2, 3, 4, 5, 6,
    7, 8, 9, 10, 11, 12
  ];


  minutes: number[] = [
    0,
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55
  ];


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}


  // =====================================================
  // INIT
  // =====================================================

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

        console.log(
          'CATEGORY API RESPONSE:',
          response
        );

        if (Array.isArray(response)) {

          this.categories = response;

        }

        else if (
          Array.isArray(response?.data)
        ) {

          this.categories = response.data;

        }

        else {

          this.categories = [];

        }

        console.log(
          'CATEGORIES:',
          this.categories
        );

      },

      error: (error) => {

        console.error(
          'CATEGORY API ERROR:',
          error
        );

        Swal.fire({
          icon: 'error',
          title: 'Category Error',
          text: 'Unable to load event categories.',
          confirmButtonColor: '#2563EB'
        });

      }

    });

  }


  // =====================================================
  // LOAD ONLY MY EVENTS
  // =====================================================

  loadEvents(): void {

    this.loading = true;

    this.eventService
      .getCoordinatorEvents()
      .subscribe({

        next: (response: any) => {

          console.log(
            'MY EVENTS API RESPONSE:',
            response
          );

          if (Array.isArray(response)) {

            this.events = response;

          }

          else if (
            Array.isArray(response?.data)
          ) {

            this.events = response.data;

          }

          else {

            this.events = [];

          }

          console.log(
            'ONLY MY EVENTS:',
            this.events
          );

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'MY EVENTS ERROR:',
            error
          );

          this.events = [];

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
  // OPEN ADD EVENT MODAL
  // =====================================================

  openAddEventModal(): void {

    this.resetForm();

    const modalElement =
      document.getElementById('addEventModal');

    if (!modalElement) {
      return;
    }

    const bootstrap =
      (window as any).bootstrap;

    if (!bootstrap) {
      console.error(
        'Bootstrap is not loaded.'
      );

      return;
    }

    const modal =
      bootstrap.Modal
        .getOrCreateInstance(modalElement);

    modal.show();

  }


  // =====================================================
  // OPEN CUSTOM TIME PICKER
  // =====================================================

  openTimePicker(
    type: 'start' | 'end'
  ): void {

    this.activeTimePicker = type;

    let currentTime = '';

    if (type === 'start') {

      currentTime =
        this.newEvent.start_time;

    }
    else {

      currentTime =
        this.newEvent.end_time;

    }


    // If time already selected
    if (currentTime) {

      const parts =
        currentTime.split(':');

      let hour =
        Number(parts[0]);

      const minute =
        Number(parts[1]);


      if (hour === 0) {

        this.timePickerHour = 12;

        this.timePickerPeriod = 'AM';

      }

      else if (hour < 12) {

        this.timePickerHour = hour;

        this.timePickerPeriod = 'AM';

      }

      else if (hour === 12) {

        this.timePickerHour = 12;

        this.timePickerPeriod = 'PM';

      }

      else {

        this.timePickerHour =
          hour - 12;

        this.timePickerPeriod = 'PM';

      }


      this.timePickerMinute =
        minute;

    }

    else {

      this.timePickerHour = 12;

      this.timePickerMinute = 0;

      this.timePickerPeriod = 'AM';

    }

  }


  // =====================================================
  // SELECT HOUR
  // =====================================================

  selectHour(hour: number): void {

    this.timePickerHour = hour;

  }


  // =====================================================
  // SELECT MINUTE
  // =====================================================

  selectMinute(minute: number): void {

    this.timePickerMinute = minute;

  }


  // =====================================================
  // SELECT AM / PM
  // =====================================================

  selectPeriod(
    period: 'AM' | 'PM'
  ): void {

    this.timePickerPeriod = period;

  }


  // =====================================================
  // CONFIRM TIME
  // =====================================================

  confirmTime(): void {

    const hour =
      String(
        this.timePickerHour
      ).padStart(2, '0');

    const minute =
      String(
        this.timePickerMinute
      ).padStart(2, '0');


    // Display value
    const displayTime =
      `${hour}:${minute} ${this.timePickerPeriod}`;


    // Convert to 24-hour
    let hour24 =
      this.timePickerHour;


    if (this.timePickerPeriod === 'AM') {

      if (hour24 === 12) {

        hour24 = 0;

      }

    }

    else {

      if (hour24 !== 12) {

        hour24 += 12;

      }

    }


    const apiTime =
      `${String(hour24).padStart(2, '0')}:${minute}`;


    // START TIME
    if (
      this.activeTimePicker === 'start'
    ) {

      this.newEvent.start_time =
        apiTime;

      this.newEvent.start_time_display =
        displayTime;

    }


    // END TIME
    if (
      this.activeTimePicker === 'end'
    ) {

      this.newEvent.end_time =
        apiTime;

      this.newEvent.end_time_display =
        displayTime;

    }


    this.activeTimePicker = null;

  }


  // =====================================================
  // ADD EVENT
  // =====================================================

 addEvent(form: NgForm): void {

  // ==============================
  // FORM VALIDATION
  // ==============================

  if (form.invalid) {
    form.control.markAllAsTouched();
    return;
  }

  // ==============================
  // DATE & TIME VALIDATION
  // ==============================

  if (!this.validateEventDateTime()) {
    return;
  }

  this.loading = true;

  // ==============================
  // EVENT DATA
  // ==============================

  const eventData = {

    category_id: Number(this.newEvent.category_id),

    event_name:
      this.newEvent.event_name.trim(),

    description:
      this.newEvent.description?.trim() || null,

    venue:
      this.newEvent.venue.trim(),

    event_date:
      this.newEvent.event_date,

    start_time:
      `${this.newEvent.start_time}:00`,

    end_time:
      `${this.newEvent.end_time}:00`,

    max_participants:
      Number(this.newEvent.max_participants)

  };

  console.log('========== EVENT DATA ==========');
  console.log('EDITING ID:', this.editingEventId);
  console.log('EVENT DATA:', eventData);
  console.log('================================');


  // ==============================
  // CREATE OR UPDATE
  // ==============================

  const request$ = this.editingEventId !== null

    ? this.eventService.updateCoordinatorEvent(
        this.editingEventId,
        eventData
      )

    : this.eventService.addCoordinatorEvent(
        eventData
      );


  request$.subscribe({

    // ==============================
    // SUCCESS
    // ==============================

    next: (response: any) => {

      this.loading = false;

      // IMPORTANT:
      // Store this BEFORE setting editingEventId = null
      const wasEditing =
        this.editingEventId !== null;


      console.log(
        wasEditing
          ? 'EVENT UPDATED:'
          : 'EVENT CREATED:',
        response
      );


      // ==============================
      // CLOSE MODAL
      // ==============================

      const modalElement =
        document.getElementById('addEventModal');

      if (modalElement) {

        const bootstrap =
          (window as any).bootstrap;

        if (bootstrap) {

          const modal =
            bootstrap.Modal
              .getInstance(modalElement);

          modal?.hide();

        }

      }


      // ==============================
      // RESET FORM
      // ==============================

      form.resetForm();

      this.resetForm();

      // Reset edit mode
      this.editingEventId = null;


      // ==============================
      // RELOAD MY EVENTS
      // ==============================

      this.loadEvents();


      // ==============================
      // SUCCESS MESSAGE
      // ==============================

      Swal.fire({

        icon: 'success',

        title:
          wasEditing
            ? 'Event Updated!'
            : 'Event Created!',

        text:
          response.message ||
          (
            wasEditing
              ? 'Event updated successfully.'
              : 'Event submitted successfully. Waiting for admin approval.'
          ),

        confirmButtonColor: '#2563EB'

      });

    },


    // ==============================
    // ERROR
    // ==============================

    error: (error) => {

      this.loading = false;

      console.error(
        '========== EVENT OPERATION ERROR =========='
      );

      console.error(
        'STATUS:',
        error.status
      );

      console.error(
        'ERROR BODY:',
        error.error
      );

      console.error(
        'MESSAGE:',
        error.error?.message
      );

      console.error(
        'VALIDATION:',
        error.error?.errors
      );

      console.error(
        '==========================================='
      );


      let message =
        'Unable to save event.';


      // ==============================
      // VALIDATION ERROR
      // ==============================

      if (error.status === 422) {

        const errors =
          error.error?.errors;

        if (errors) {

          message =
            Object.entries(errors)
              .map(
                ([field, messages]: [string, any]) =>
                  `${field}: ${messages.join(', ')}`
              )
              .join('\n');

        }

        else if (error.error?.message) {

          message =
            error.error.message;

        }

      }


      // ==============================
      // AUTH ERROR
      // ==============================

      else if (error.status === 401) {

        message =
          'Coordinator authentication failed. Please login again.';

      }


      // ==============================
      // NOT FOUND / UNAUTHORIZED
      // ==============================

      else if (error.status === 404) {

        message =
          error.error?.message ||
          'Event not found or you are not authorized to edit this event.';

      }


      // ==============================
      // SERVER ERROR
      // ==============================

      else if (error.status === 500) {

        message =
          'Server error. Please check the Laravel terminal.';

      }


      Swal.fire({

        icon: 'error',

        title:
          this.editingEventId !== null
            ? 'Failed to Update Event'
            : 'Failed to Create Event',

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
      start_time_display: '',

      end_time: '',
      end_time_display: '',

      max_participants: null

    };


    this.activeTimePicker = null;

    this.timePickerHour = 12;

    this.timePickerMinute = 0;

    this.timePickerPeriod = 'AM';

  }


  // =====================================================
  // TODAY'S DATE
  // =====================================================

  getToday(): string {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');


    return `${year}-${month}-${day}`;

  }


  // =====================================================
  // VALIDATE EVENT DATE & TIME
  // =====================================================

  validateEventDateTime(): boolean {

    // Date
    if (!this.newEvent.event_date) {

      Swal.fire({

        icon: 'warning',

        title: 'Select Event Date',

        text:
          'Please select an event date.',

        confirmButtonColor: '#2563EB'

      });

      return false;

    }


    // Start time
    if (!this.newEvent.start_time) {

      Swal.fire({

        icon: 'warning',

        title: 'Select Start Time',

        text:
          'Please select the event start time.',

        confirmButtonColor: '#2563EB'

      });

      return false;

    }


    // End time
    if (!this.newEvent.end_time) {

      Swal.fire({

        icon: 'warning',

        title: 'Select End Time',

        text:
          'Please select the event end time.',

        confirmButtonColor: '#2563EB'

      });

      return false;

    }


    // -----------------------------------------
    // Create selected date/time
    // -----------------------------------------

    const selectedStart =
      new Date(
        `${this.newEvent.event_date}T${this.newEvent.start_time}`
      );


    const selectedEnd =
      new Date(
        `${this.newEvent.event_date}T${this.newEvent.end_time}`
      );


    const now =
      new Date();


    // -----------------------------------------
    // Previous date/time
    // -----------------------------------------

    if (selectedStart <= now) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Event Time',

        text:
          'Please select a future date and time.',

        confirmButtonColor: '#2563EB'

      });

      return false;

    }


    // -----------------------------------------
    // End time
    // -----------------------------------------

    if (selectedEnd <= selectedStart) {

      Swal.fire({

        icon: 'warning',

        title: 'Invalid Time',

        text:
          'End time must be later than start time.',

        confirmButtonColor: '#2563EB'

      });

      return false;

    }


    return true;

  }

selectedEvent: any = null;

viewEvent(event: any): void {
  this.selectedEvent = event;

  const modalElement = document.getElementById('viewEventModal');

  if (modalElement) {
    const bootstrap = (window as any).bootstrap;
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
    modal.show();
  }
}

deleteEvent(id: number): void {

  Swal.fire({
    icon: 'warning',
    title: 'Delete Event?',
    text: 'This event will be permanently deleted.',
    showCancelButton: true,
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#6B7280'
  }).then((result) => {

    if (!result.isConfirmed) {
      return;
    }

    this.loading = true;

    this.eventService.deleteCoordinatorEvent(id).subscribe({

      next: (response: any) => {

        this.loading = false;

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: response.message || 'Event deleted successfully.',
          confirmButtonColor: '#2563EB'
        });

        // Refresh My Events
        this.loadEvents();

      },

      error: (error) => {

        this.loading = false;

        console.error('Delete event error:', error);

        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text:
            error.error?.message ||
            'Unable to delete event.',
          confirmButtonColor: '#DC2626'
        });

      }

    });

  });

}
setTimeForPicker(
  time: string,
  type: 'start' | 'end'
): void {

  if (!time) {
    return;
  }

  const parts = time.substring(0, 5).split(':');

  let hour = Number(parts[0]);
  const minute = parts[1];

  const period = hour >= 12 ? 'PM' : 'AM';

  if (hour === 0) {
    hour = 12;
  }
  else if (hour > 12) {
    hour -= 12;
  }

  if (type === 'start') {

    this.newEvent.start_hour = hour;
    this.newEvent.start_minute = minute;
    this.newEvent.start_period = period;

  }
  else {

    this.newEvent.end_hour = hour;
    this.newEvent.end_minute = minute;
    this.newEvent.end_period = period;

  }

}


editingEventId: number | null = null;

editEvent(event: any): void {

  this.editingEventId = event.id;

  this.newEvent = {
    category_id: event.category_id,
    event_name: event.event_name,
    description: event.description || '',
    venue: event.venue,
    event_date: event.event_date,
    start_hour: '',
    start_minute: '',
    start_period: '',
    end_hour: '',
    end_minute: '',
    end_period: '',
    max_participants: event.max_participants
  };

  // Convert database time to AM/PM picker
  this.setTimeForPicker(
    event.start_time,
    'start'
  );

  this.setTimeForPicker(
    event.end_time,
    'end'
  );

  const modalElement =
    document.getElementById('addEventModal');

  if (modalElement) {

    const bootstrap = (window as any).bootstrap;

    const modal =
      bootstrap.Modal.getOrCreateInstance(
        modalElement
      );

    modal.show();

  }

}

}