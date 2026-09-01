import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AttendanceService } from '../../../core/services/attendance';

@Component({
  selector: 'app-coordinator-attendance',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './attendance.html',
  styleUrl: './attendance.css'
})
export class CoordinatorAttendance implements OnInit {

  // =====================================================
  // EVENTS
  // =====================================================

  events: any[] = [];

  selectedEventId: number | null = null;


  // =====================================================
  // PARTICIPANTS
  // =====================================================

  participants: any[] = [];

  loading = false;

  loadingParticipants = false;


  // =====================================================
  // ATTENDANCE DATE
  // =====================================================

  attendanceDate = this.getToday();


  constructor(
    private attendanceService: AttendanceService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadEvents();

  }


  // =====================================================
  // GET TODAY'S DATE
  // =====================================================

  getToday(): string {

    const today = new Date();

    return today.toISOString().split('T')[0];

  }


  // =====================================================
  // LOAD COORDINATOR ATTENDANCE
  // =====================================================

  loadEvents(): void {

  this.loading = true;

  this.attendanceService
    .getCoordinatorEvents()
    .subscribe({

      next: (response: any) => {

        console.log('COORDINATOR EVENTS:', response);

        this.events =
          Array.isArray(response)
            ? response
            : response?.data || [];

        this.loading = false;

      },

      error: (error) => {

        console.error('LOAD EVENTS ERROR:', error);

        this.events = [];

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Events',
          text:
            error.error?.message ||
            'Unable to load coordinator events.',
          confirmButtonColor: '#2563EB'
        });

      }

    });

}


  // =====================================================
  // EVENT SELECTED
  // =====================================================

  eventChanged(): void {

    this.participants = [];


    if (!this.selectedEventId) {

      return;

    }


    this.loadParticipants(
      this.selectedEventId
    );

  }


  // =====================================================
  // LOAD APPROVED PARTICIPANTS
  // =====================================================

  loadParticipants(
    eventId: number
  ): void {

    this.loadingParticipants = true;


    this.attendanceService
      .getEventParticipants(eventId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'APPROVED PARTICIPANTS:',
            response
          );


          const registrations =
            Array.isArray(response)
              ? response
              : response?.data || [];


          /*
           * Convert registrations into
           * attendance-ready participants.
           */

          this.participants =
            registrations.map(
              (registration: any) => {

                const existingAttendance =
                  registration.attendances?.find(
                    (attendance: any) =>
                      attendance.attendance_date ===
                      this.attendanceDate
                  );


                return {

                  ...registration,

                  attendanceStatus:
                    existingAttendance?.status ||
                    ''

                };

              }
            );


          this.loadingParticipants = false;

        },


        error: (error) => {

          console.error(
            'LOAD PARTICIPANTS ERROR:',
            error
          );


          this.participants = [];

          this.loadingParticipants = false;


          Swal.fire({

            icon: 'error',

            title: 'Unable to Load Participants',

            text:
              error.error?.message ||
              'Something went wrong.',

            confirmButtonColor: '#2563EB'

          });

        }

      });

  }


 // =====================================================
// MARK ATTENDANCE
// =====================================================

markAttendance(
  registration: any,
  status: 'Present' | 'Absent'
): void {

  // 1. Check date is selected
  if (!this.attendanceDate) {

    Swal.fire({
      icon: 'warning',
      title: 'Select Date',
      text: 'Please select an attendance date.',
      confirmButtonColor: '#2563EB'
    });

    return;
  }


  // 2. Check event is selected
  if (!this.selectedEventId) {

    Swal.fire({
      icon: 'warning',
      title: 'Select Event',
      text: 'Please select an event first.',
      confirmButtonColor: '#2563EB'
    });

    return;
  }


  // 3. Validate attendance date
  if (!this.isValidAttendanceDate()) {

    Swal.fire({
      icon: 'warning',
      title: 'Invalid Attendance Date',
      text: 'Attendance can only be marked on the event date.',
      confirmButtonColor: '#2563EB'
    });

    return;
  }


  // 4. Mark attendance in UI
  registration.attendanceStatus = status;


  // 5. Save attendance
  this.attendanceService
    .markAttendance({

      registration_id:
        registration.id,

      attendance_date:
        this.attendanceDate,

      status:
        status

    })
    .subscribe({

      next: (response: any) => {

        console.log(
          'ATTENDANCE SAVED:',
          response
        );


        Swal.fire({

          icon: 'success',

          title: 'Attendance Saved',

          text:
            response.message ||
            'Attendance marked successfully.',

          timer: 1500,

          showConfirmButton: false

        });

      },


      error: (error) => {

        console.error(
          'MARK ATTENDANCE ERROR:',
          error
        );


        registration.attendanceStatus = '';


        Swal.fire({

          icon: 'error',

          title: 'Failed',

          text:
            error.error?.message ||
            'Unable to mark attendance.',

          confirmButtonColor: '#DC2626'

        });

      }

    });

}


  // =====================================================
  // CHANGE DATE
  // =====================================================

  dateChanged(): void {

    if (!this.selectedEventId) {

      return;

    }


    this.loadParticipants(
      this.selectedEventId
    );

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.participants = [];


    if (this.selectedEventId) {

      this.loadParticipants(
        this.selectedEventId
      );

    }
    else {

      this.loadEvents();

    }

  }

isValidAttendanceDate(): boolean {

  if (!this.attendanceDate || !this.selectedEventId) {
    return false;
  }

  const event = this.events.find(
    e => Number(e.id) === Number(this.selectedEventId)
  );

  if (!event?.event_date) {
    return false;
  }

  return this.attendanceDate === event.event_date;
}

getSelectedEventDate(): string {

  const event = this.events.find(
    e => Number(e.id) === Number(this.selectedEventId)
  );

  return event?.event_date || '';

}

}