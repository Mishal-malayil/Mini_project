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

    // Form validation
    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }


    // Date and time validation
    if (!this.validateEventDateTime()) {

      return;

    }


    this.loading = true;


    const eventData = {
       
  
       

      category_id:
        Number(
          this.newEvent.category_id
        ),

      event_name:
        this.newEvent.event_name,

      description:
        this.newEvent.description || null,

      venue:
        this.newEvent.venue,

      event_date:
        this.newEvent.event_date,

      start_time:
        this.newEvent.start_time + ':00',

      end_time:
        this.newEvent.end_time + ':00',

      max_participants:
        Number(
          this.newEvent.max_participants
        )

    };


    console.log(
      'EVENT DATA:',
      eventData
    );


    this.eventService
      .addCoordinatorEvent(eventData)
      .subscribe({

        // =================================================
        // SUCCESS
        // =================================================

        next: (response: any) => {

          this.loading = false;


          // Close modal
          const modalElement =
            document.getElementById(
              'addEventModal'
            );

          if (modalElement) {

            const bootstrap =
              (window as any).bootstrap;

            const modal =
              bootstrap.Modal
                .getInstance(modalElement);

            modal?.hide();

          }


          // Reset form
          form.resetForm();

          this.resetForm();


          // Reload only my events
          this.loadEvents();


          Swal.fire({

            icon: 'success',

            title: 'Event Created!',

            text:
              response.message ||
              'Event submitted successfully. Waiting for admin approval.',

            confirmButtonColor: '#2563EB'

          });

        },


        // =================================================
        // ERROR
        // =================================================

        error: (error) => {

          this.loading = false;


          console.error(
            'ADD EVENT ERROR:',
            error
          );


          let message =
            'Unable to create event.';


          // Validation error
          if (error.status === 422) {

            const errors =
              error.error?.errors;


            if (errors) {

              message =
                Object.values(errors)
                  .flat()
                  .join('\n');

            }

            else if (
              error.error?.message
            ) {

              message =
                error.error.message;

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

}