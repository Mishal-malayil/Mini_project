import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AnnouncementService } from '../../../core/services/announcement';
import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './notification.html',
  styleUrl: './notification.css'
})
export class Notification implements OnInit {

  // =========================
  // DATA
  // =========================

  events: any[] = [];
  announcements: any[] = [];

  // =========================
  // FORM
  // =========================

  selectedEventId: number | null = null;

  title = '';

  message = '';

  // Automatically select today's date
  publishedAt = this.getToday();

  // =========================
  // LOADING
  // =========================

  isLoading = false;


  // =========================
  // CONSTRUCTOR
  // =========================

  constructor(
    private announcementService: AnnouncementService,
    private eventService: EventService
  ) {}


  // =========================
  // ON INIT
  // =========================

  ngOnInit(): void {

    this.loadEvents();

    this.loadAnnouncements();

  }


  // =========================
  // GET TODAY'S DATE
  // =========================

  getToday(): string {

    const today = new Date();

    const year = today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, '0');

    const day = String(
      today.getDate()
    ).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }


  // =========================
  // DATE VALIDATION
  // =========================

  isValidNotificationDate(): boolean {

    return this.publishedAt === this.getToday();

  }


  // =========================
  // LOAD COORDINATOR EVENTS
  // =========================

  loadEvents(): void {

    this.eventService
      .getCoordinatorEvents()
      .subscribe({

        next: (res: any) => {

          this.events = Array.isArray(res)
            ? res
            : res?.events || [];

          console.log(
            'Coordinator events:',
            this.events
          );

        },

        error: (err) => {

          console.error(
            'Error loading events:',
            err
          );

          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: 'Unable to load your events.',
            confirmButtonColor: '#2563EB'
          });

        }

      });

  }


  // =========================
  // LOAD NOTIFICATION HISTORY
  // =========================

  loadAnnouncements(): void {

    this.announcementService
      .getCoordinatorAnnouncements()
      .subscribe({

        next: (res: any) => {

          this.announcements = Array.isArray(res)
            ? res
            : res?.announcements || [];

          console.log(
            'Coordinator announcements:',
            this.announcements
          );

        },

        error: (err) => {

          console.error(
            'Error loading announcements:',
            err
          );

        }

      });

  }


  // =========================
  // SEND NOTIFICATION
  // =========================

  sendNotification(): void {

    // -------------------------
    // EVENT VALIDATION
    // -------------------------

    if (!this.selectedEventId) {

      Swal.fire({
        icon: 'warning',
        title: 'Select Event',
        text: 'Please select an event.',
        confirmButtonColor: '#2563EB'
      });

      return;

    }


    // -------------------------
    // TITLE VALIDATION
    // -------------------------

    if (!this.title.trim()) {

      Swal.fire({
        icon: 'warning',
        title: 'Title Required',
        text: 'Please enter a notification title.',
        confirmButtonColor: '#2563EB'
      });

      return;

    }


    // -------------------------
    // MESSAGE VALIDATION
    // -------------------------

    if (!this.message.trim()) {

      Swal.fire({
        icon: 'warning',
        title: 'Message Required',
        text: 'Please enter the notification message.',
        confirmButtonColor: '#2563EB'
      });

      return;

    }


    // -------------------------
    // DATE REQUIRED
    // -------------------------

    if (!this.publishedAt) {

      Swal.fire({
        icon: 'warning',
        title: 'Date Required',
        text: 'Please select the publish date.',
        confirmButtonColor: '#2563EB'
      });

      return;

    }


    // -------------------------
    // DATE VALIDATION
    // ONLY TODAY ALLOWED
    // -------------------------

    if (!this.isValidNotificationDate()) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Date',
        text: 'Notification can only be sent with today’s date.',
        confirmButtonColor: '#2563EB'
      });

      // Reset to today's date
      this.publishedAt = this.getToday();

      return;

    }


    // -------------------------
    // REQUEST DATA
    // -------------------------

    const data = {

      event_id: Number(
        this.selectedEventId
      ),

      title: this.title.trim(),

      message: this.message.trim(),

      published_at: this.publishedAt

    };


    console.log(
      'Sending notification:',
      data
    );


    // -------------------------
    // START LOADING
    // -------------------------

    this.isLoading = true;


    // -------------------------
    // API REQUEST
    // -------------------------

    this.announcementService
      .sendCoordinatorAnnouncement(data)
      .subscribe({

        // =====================
        // SUCCESS
        // =====================

        next: (res: any) => {

          this.isLoading = false;

          Swal.fire({
            icon: 'success',
            title: 'Notification Sent',
            text:
              res?.message ||
              'Notification sent successfully.',
            confirmButtonColor: '#2563EB'
          });


          // Reset form
          this.resetForm();


          // Refresh history
          this.loadAnnouncements();

        },


        // =====================
        // ERROR
        // =====================

        error: (err) => {

          this.isLoading = false;

          console.error(
            'Send notification error:',
            err
          );


          let errorMessage =
            'Unable to send notification.';


          // Laravel validation errors
          if (err?.error?.errors) {

            const errors =
              err.error.errors;

            const messages: string[] = [];

            Object.keys(errors).forEach(
              key => {

                if (
                  Array.isArray(errors[key])
                ) {

                  messages.push(
                    ...errors[key]
                  );

                }

              }
            );

            if (messages.length > 0) {

              errorMessage =
                messages.join('\n');

            }

          }
          else if (err?.error?.message) {

            errorMessage =
              err.error.message;

          }


          Swal.fire({
            icon: 'error',
            title: 'Failed',
            text: errorMessage,
            confirmButtonColor: '#2563EB'
          });

        }

      });

  }


  // =========================
  // RESET FORM
  // =========================

  resetForm(): void {

    this.selectedEventId = null;

    this.title = '';

    this.message = '';

    // Reset date to today
    this.publishedAt = this.getToday();

  }


  // =========================
  // DELETE NOTIFICATION
  // =========================

  deleteNotification(id: number): void {

    Swal.fire({

      title: 'Delete Notification?',

      text:
        'This notification will be permanently deleted.',

      icon: 'warning',

      showCancelButton: true,

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#DC2626',

      cancelButtonColor: '#6B7280'

    }).then((result) => {

      if (!result.isConfirmed) {

        return;

      }


      this.announcementService
        .deleteCoordinatorAnnouncement(id)
        .subscribe({

          // =====================
          // SUCCESS
          // =====================

          next: () => {

            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text:
                'Notification deleted successfully.',
              confirmButtonColor: '#2563EB'
            });


            // Refresh history
            this.loadAnnouncements();

          },


          // =====================
          // ERROR
          // =====================

          error: (err) => {

            console.error(
              'Delete notification error:',
              err
            );


            Swal.fire({
              icon: 'error',
              title: 'Failed',
              text:
                err?.error?.message ||
                'Unable to delete notification.',
              confirmButtonColor: '#2563EB'
            });

          }

        });

    });

  }


  // =========================
  // GET EVENT NAME
  // =========================

  getEventName(eventId: number): string {

    const event = this.events.find(
      e =>
        Number(e.id) ===
        Number(eventId)
    );

    return event?.event_name || '-';

  }

}