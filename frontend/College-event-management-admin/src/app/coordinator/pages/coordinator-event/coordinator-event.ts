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
  // ADD / EDIT EVENT FORM
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

  editingEventId: number | null = null;

  // =====================================================
  // CUSTOM TIME PICKER
  // =====================================================

  activeTimePicker: 'start' | 'end' | null = null;

  timePickerHour = 12;
  timePickerMinute = 0;
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
  // IMAGE
  // =====================================================

  selectedImage: File | null = null;

  // =====================================================
  // VIEW EVENT
  // =====================================================

  selectedEvent: any = null;

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

        } else if (
          Array.isArray(response?.data)
        ) {

          this.categories = response.data;

        } else {

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

          } else if (
            Array.isArray(response?.data)
          ) {

            this.events = response.data;

          } else {

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
            }).then(() => {

              this.router.navigate([
                '/coordinator/login'
              ]);

            });

          }

        }

      });

  }

  // =====================================================
  // OPEN ADD EVENT MODAL
  // =====================================================

  openAddEventModal(): void {

    this.editingEventId = null;

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

    } else {

      currentTime =
        this.newEvent.end_time;

    }

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

      } else if (hour < 12) {

        this.timePickerHour = hour;
        this.timePickerPeriod = 'AM';

      } else if (hour === 12) {

        this.timePickerHour = 12;
        this.timePickerPeriod = 'PM';

      } else {

        this.timePickerHour =
          hour - 12;

        this.timePickerPeriod = 'PM';

      }

      this.timePickerMinute =
        minute;

    } else {

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

    const displayTime =
      `${hour}:${minute} ${this.timePickerPeriod}`;

    let hour24 =
      this.timePickerHour;

    if (
      this.timePickerPeriod === 'AM'
    ) {

      if (hour24 === 12) {
        hour24 = 0;
      }

    } else {

      if (hour24 !== 12) {
        hour24 += 12;
      }

    }

    const apiTime =
      `${String(hour24).padStart(2, '0')}:${minute}`;

    if (
      this.activeTimePicker === 'start'
    ) {

      this.newEvent.start_time =
        apiTime;

      this.newEvent.start_time_display =
        displayTime;

    }

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
  // ADD / UPDATE EVENT
  // =====================================================

  addEvent(form: NgForm): void {

    // ---------------------------------------------------
    // FORM VALIDATION
    // ---------------------------------------------------

    if (form.invalid) {

      form.control.markAllAsTouched();

      return;

    }

    // ---------------------------------------------------
    // DATE & TIME VALIDATION
    // ---------------------------------------------------

    if (
      !this.validateEventDateTime()
    ) {

      return;

    }

    this.loading = true;

    // ---------------------------------------------------
    // FORM DATA
    // ---------------------------------------------------

    const eventData =
      new FormData();

    eventData.append(
      'category_id',
      String(
        Number(
          this.newEvent.category_id
        )
      )
    );

    eventData.append(
      'event_name',
      this.newEvent.event_name.trim()
    );

    eventData.append(
      'description',
      this.newEvent.description?.trim() || ''
    );

    eventData.append(
      'venue',
      this.newEvent.venue.trim()
    );

    eventData.append(
      'event_date',
      this.newEvent.event_date
    );

    eventData.append(
      'start_time',
      `${this.newEvent.start_time}:00`
    );

    eventData.append(
      'end_time',
      `${this.newEvent.end_time}:00`
    );

    if (
      this.newEvent.max_participants !== null &&
      this.newEvent.max_participants !== ''
    ) {

      eventData.append(
        'max_participants',
        String(
          Number(
            this.newEvent.max_participants
          )
        )
      );

    }

    // ---------------------------------------------------
    // IMAGE
    // ---------------------------------------------------

    if (this.selectedImage) {

      eventData.append(
        'image',
        this.selectedImage,
        this.selectedImage.name
      );

    }

    // ---------------------------------------------------
    // DEBUG
    // ---------------------------------------------------

    console.log(
      'SELECTED IMAGE:',
      this.selectedImage
    );

    eventData.forEach(
      (value, key) => {

        console.log(
          'FORM DATA:',
          key,
          value
        );

      }
    );

    // ---------------------------------------------------
    // CREATE / UPDATE
    // ---------------------------------------------------

    let request$;

    if (
      this.editingEventId !== null
    ) {

      // Laravel method spoofing
      eventData.append(
        '_method',
        'PUT'
      );

      request$ =
        this.eventService
          .updateCoordinatorEvent(
            this.editingEventId,
            eventData
          );

    } else {

      request$ =
        this.eventService
          .addCoordinatorEvent(
            eventData
          );

    }

    // ---------------------------------------------------
    // ONLY ONE SUBSCRIBE
    // ---------------------------------------------------

    request$.subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: (response: any) => {

        this.loading = false;

        const wasEditing =
          this.editingEventId !== null;

        console.log(
          wasEditing
            ? 'EVENT UPDATED:'
            : 'EVENT CREATED:',
          response
        );

        // ------------------------------------------------
        // CLOSE MODAL
        // ------------------------------------------------

        const modalElement =
          document.getElementById(
            'addEventModal'
          );

        if (modalElement) {

          const bootstrap =
            (window as any).bootstrap;

          if (bootstrap) {

            const modal =
              bootstrap.Modal
                .getInstance(
                  modalElement
                );

            modal?.hide();

          }

        }

        // ------------------------------------------------
        // RESET FORM
        // ------------------------------------------------

        form.resetForm();

        this.resetForm();

        this.editingEventId =
          null;

        // ------------------------------------------------
        // RELOAD EVENTS
        // ------------------------------------------------

        this.loadEvents();

        // ------------------------------------------------
        // SUCCESS MESSAGE
        // ------------------------------------------------

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

          confirmButtonColor:
            '#2563EB'

        });

      },

      // =================================================
      // ERROR
      // =================================================

      error: (error) => {

        this.loading = false;

        console.error(
          'EVENT OPERATION ERROR:',
          error
        );

        let message =
          'Unable to save event.';

        // ------------------------------------------------
        // VALIDATION / VENUE CONFLICT
        // ------------------------------------------------

        if (
          error.status === 422
        ) {

          const errors =
            error.error?.errors;

          if (errors) {

            message =
              Object.entries(errors)
                .map(
                  (
                    [field, messages]:
                    [string, any]
                  ) =>
                    `${field}: ${messages.join(', ')}`
                )
                .join('\n');

          } else if (
            error.error?.message
          ) {

            message =
              error.error.message;

          }

        }

        // ------------------------------------------------
        // AUTH ERROR
        // ------------------------------------------------

        else if (
          error.status === 401
        ) {

          message =
            'Coordinator authentication failed. Please login again.';

        }

        // ------------------------------------------------
        // NOT FOUND
        // ------------------------------------------------

        else if (
          error.status === 404
        ) {

          message =
            error.error?.message ||
            'Event not found or you are not authorized to edit this event.';

        }

        // ------------------------------------------------
        // SERVER ERROR
        // ------------------------------------------------

        else if (
          error.status === 500
        ) {

          message =
            'Server error. Please check the Laravel terminal.';

        }

        // ------------------------------------------------
        // SWEET ALERT
        // ------------------------------------------------

        Swal.fire({

          icon: 'error',

          title:
            error.status === 422
              ? 'Venue Not Available'
              : (
                  this.editingEventId !== null
                    ? 'Failed to Update Event'
                    : 'Failed to Create Event'
                ),

          text: message,

          confirmButtonColor:
            '#DC2626'

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

    this.selectedImage = null;

    this.activeTimePicker = null;

    this.timePickerHour = 12;

    this.timePickerMinute = 0;

    this.timePickerPeriod = 'AM';

  }

  // =====================================================
  // TODAY'S DATE
  // =====================================================

  getToday(): string {

    const today =
      new Date();

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

    // ---------------------------------------------------
    // DATE
    // ---------------------------------------------------

    if (
      !this.newEvent.event_date
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Select Event Date',

        text:
          'Please select an event date.',

        confirmButtonColor:
          '#2563EB'

      });

      return false;

    }

    // ---------------------------------------------------
    // START TIME
    // ---------------------------------------------------

    if (
      !this.newEvent.start_time
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Select Start Time',

        text:
          'Please select the event start time.',

        confirmButtonColor:
          '#2563EB'

      });

      return false;

    }

    // ---------------------------------------------------
    // END TIME
    // ---------------------------------------------------

    if (
      !this.newEvent.end_time
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Select End Time',

        text:
          'Please select the event end time.',

        confirmButtonColor:
          '#2563EB'

      });

      return false;

    }

    // ---------------------------------------------------
    // SELECTED DATE/TIME
    // ---------------------------------------------------

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

    // ---------------------------------------------------
    // PREVIOUS DATE/TIME
    // ---------------------------------------------------

    if (
      selectedStart <= now
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Invalid Event Time',

        text:
          'Please select a future date and time.',

        confirmButtonColor:
          '#2563EB'

      });

      return false;

    }

    // ---------------------------------------------------
    // END TIME
    // ---------------------------------------------------

    if (
      selectedEnd <= selectedStart
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Invalid Time',

        text:
          'End time must be later than start time.',

        confirmButtonColor:
          '#2563EB'

      });

      return false;

    }

    return true;

  }

  // =====================================================
  // VIEW EVENT
  // =====================================================

  viewEvent(event: any): void {

    this.selectedEvent =
      event;

    const modalElement =
      document.getElementById(
        'viewEventModal'
      );

    if (modalElement) {

      const bootstrap =
        (window as any).bootstrap;

      if (!bootstrap) {
        return;
      }

      const modal =
        bootstrap.Modal
          .getOrCreateInstance(
            modalElement
          );

      modal.show();

    }

  }

  // =====================================================
  // DELETE EVENT
  // =====================================================

  deleteEvent(id: number): void {

    Swal.fire({

      icon: 'warning',

      title:
        'Delete Event?',

      text:
        'This event will be permanently deleted.',

      showCancelButton: true,

      confirmButtonText:
        'Yes, Delete',

      cancelButtonText:
        'Cancel',

      confirmButtonColor:
        '#DC2626',

      cancelButtonColor:
        '#6B7280',

      reverseButtons: true

    }).then(
      (result) => {

        if (
          !result.isConfirmed
        ) {
          return;
        }

        this.loading = true;

        this.eventService
          .deleteCoordinatorEvent(id)
          .subscribe({

            next: (response: any) => {

              this.loading = false;

              Swal.fire({

                icon: 'success',

                title:
                  'Deleted!',

                text:
                  response.message ||
                  'Event deleted successfully.',

                confirmButtonColor:
                  '#2563EB'

              });

              this.loadEvents();

            },

            error: (error) => {

              this.loading = false;

              console.error(
                'Delete event error:',
                error
              );

              Swal.fire({

                icon: 'error',

                title:
                  'Delete Failed',

                text:
                  error.error?.message ||
                  'Unable to delete event.',

                confirmButtonColor:
                  '#DC2626'

              });

            }

          });

      }
    );

  }

  // =====================================================
  // SET TIME FOR EDIT
  // =====================================================

  setTimeForPicker(
    time: string,
    type: 'start' | 'end'
  ): void {

    if (!time) {
      return;
    }

    const parts =
      time
        .substring(0, 5)
        .split(':');

    let hour =
      Number(parts[0]);

    const minute =
      parts[1];

    const period =
      hour >= 12
        ? 'PM'
        : 'AM';

    if (hour === 0) {

      hour = 12;

    } else if (hour > 12) {

      hour -= 12;

    }

    if (
      type === 'start'
    ) {

      this.newEvent.start_time =
        time.substring(0, 5);

      this.newEvent.start_time_display =
        `${String(hour).padStart(2, '0')}:${minute} ${period}`;

    } else {

      this.newEvent.end_time =
        time.substring(0, 5);

      this.newEvent.end_time_display =
        `${String(hour).padStart(2, '0')}:${minute} ${period}`;

    }

  }

  // =====================================================
  // EDIT EVENT
  // =====================================================

  editEvent(event: any): void {

    this.editingEventId =
      event.id;

    this.newEvent = {

      category_id:
        event.category_id,

      event_name:
        event.event_name,

      description:
        event.description || '',

      venue:
        event.venue,

      event_date:
        event.event_date,

      start_time:
        '',

      start_time_display:
        '',

      end_time:
        '',

      end_time_display:
        '',

      max_participants:
        event.max_participants

    };

    // ---------------------------------------------------
    // Convert database time
    // ---------------------------------------------------

    this.setTimeForPicker(
      event.start_time,
      'start'
    );

    this.setTimeForPicker(
      event.end_time,
      'end'
    );

    // ---------------------------------------------------
    // Open modal
    // ---------------------------------------------------

    const modalElement =
      document.getElementById(
        'addEventModal'
      );

    if (modalElement) {

      const bootstrap =
        (window as any).bootstrap;

      if (!bootstrap) {
        return;
      }

      const modal =
        bootstrap.Modal
          .getOrCreateInstance(
            modalElement
          );

      modal.show();

    }

  }

  // =====================================================
  // IMAGE SELECT
  // =====================================================

  onImageSelected(
    event: any
  ): void {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    // Optional frontend validation
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Invalid Image',

        text:
          'Please select a JPG, PNG or WEBP image.',

        confirmButtonColor:
          '#2563EB'

      });

      event.target.value = '';

      this.selectedImage = null;

      return;

    }

    // 5 MB
    if (
      file.size >
      5 * 1024 * 1024
    ) {

      Swal.fire({

        icon: 'warning',

        title:
          'Image Too Large',

        text:
          'Image size must be less than 5 MB.',

        confirmButtonColor:
          '#2563EB'

      });

      event.target.value = '';

      this.selectedImage = null;

      return;

    }

    this.selectedImage =
      file;

    console.log(
      'Selected image:',
      this.selectedImage
    );

  }

}