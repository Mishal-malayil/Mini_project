import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { ResultService } from '../../../core/services/result';

@Component({
  selector: 'app-coordinator-result',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './result.html',
  styleUrl: './result.css'
})
export class CoordinatorResult implements OnInit {

  // =====================================================
  // EVENTS
  // =====================================================

  events: any[] = [];

  selectedEventId: number | null = null;


  // =====================================================
  // PARTICIPANTS
  // =====================================================

  participants: any[] = [];

  loadingEvents = false;

  loadingParticipants = false;

  publishing = false;


  // =====================================================
  // RESULT FORM
  // =====================================================

  selectedStudentId: number | null = null;

  selectedPosition = '';

  remarks = '';


  // =====================================================
  // PUBLISHED RESULTS
  // =====================================================

  results: any[] = [];

  loadingResults = false;


  constructor(
    private resultService: ResultService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadEvents();

    this.loadResults();

  }


  // =====================================================
  // LOAD COORDINATOR EVENTS
  // =====================================================

  loadEvents(): void {

    this.loadingEvents = true;

    this.resultService
      .getCoordinatorEvents()
      .subscribe({

        next: (response: any) => {

          console.log(
            'COORDINATOR EVENTS:',
            response
          );

          this.events =
            Array.isArray(response)
              ? response
              : response?.data || [];

          this.loadingEvents = false;

        },

        error: (error) => {

          console.error(
            'LOAD EVENTS ERROR:',
            error
          );

          this.events = [];

          this.loadingEvents = false;

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
  // LOAD PUBLISHED RESULTS
  // =====================================================

  loadResults(): void {

    this.loadingResults = true;

    this.resultService
      .getCoordinatorResults()
      .subscribe({

        next: (response: any) => {

          console.log(
            'COORDINATOR RESULTS:',
            response
          );

          this.results =
            Array.isArray(response)
              ? response
              : response?.data || [];

          this.loadingResults = false;

        },

        error: (error) => {

          console.error(
            'LOAD RESULTS ERROR:',
            error
          );

          this.results = [];

          this.loadingResults = false;

        }

      });

  }


  // =====================================================
  // EVENT CHANGED
  // =====================================================

  eventChanged(): void {

    this.participants = [];

    this.selectedStudentId = null;

    this.selectedPosition = '';

    this.remarks = '';


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

    this.resultService
      .getEventParticipants(eventId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'APPROVED PARTICIPANTS:',
            response
          );

          this.participants =
            Array.isArray(response)
              ? response
              : response?.data || [];

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
              'Unable to load approved participants.',

            confirmButtonColor: '#2563EB'

          });

        }

      });

  }


  // =====================================================
  // CHECK POSITION
  // =====================================================

  isPositionTaken(
    position: string
  ): boolean {

    if (!this.selectedEventId) {

      return false;

    }

    return this.results.some(
      result =>
        Number(result.event_id) ===
          Number(this.selectedEventId) &&

        result.position === position
    );

  }


  // =====================================================
  // PUBLISH RESULT
  // =====================================================

  publishResult(): void {

    // ---------------------------------------------------
    // Validate event
    // ---------------------------------------------------

    if (!this.selectedEventId) {

      Swal.fire({

        icon: 'warning',

        title: 'Select Event',

        text: 'Please select an event first.',

        confirmButtonColor: '#2563EB'

      });

      return;

    }


    // ---------------------------------------------------
    // Validate participant
    // ---------------------------------------------------

    if (!this.selectedStudentId) {

      Swal.fire({

        icon: 'warning',

        title: 'Select Participant',

        text: 'Please select a participant.',

        confirmButtonColor: '#2563EB'

      });

      return;

    }


    // ---------------------------------------------------
    // Validate position
    // ---------------------------------------------------

    if (!this.selectedPosition) {

      Swal.fire({

        icon: 'warning',

        title: 'Select Position',

        text: 'Please select a result position.',

        confirmButtonColor: '#2563EB'

      });

      return;

    }


    // ---------------------------------------------------
    // Prevent duplicate winner position
    // ---------------------------------------------------

    if (
      this.selectedPosition !== 'Participation' &&
      this.isPositionTaken(
        this.selectedPosition
      )
    ) {

      Swal.fire({

        icon: 'warning',

        title: 'Position Already Assigned',

        text:
          `${this.selectedPosition} position is already assigned for this event.`,

        confirmButtonColor: '#2563EB'

      });

      return;

    }


    const participant =
      this.participants.find(
        student =>
          Number(student.id) ===
          Number(this.selectedStudentId)
      );


    const positionText =
      this.getPositionLabel(
        this.selectedPosition
      );


    Swal.fire({

      icon: 'question',

      title: 'Publish Result?',

      html: `
        <div style="text-align:left">

          <p>
            <strong>Student:</strong>
            ${participant?.name || 'N/A'}
          </p>

          <p>
            <strong>Position:</strong>
            ${positionText}
          </p>

        </div>
      `,

      showCancelButton: true,

      confirmButtonText: 'Yes, Publish',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#2563EB',

      cancelButtonColor: '#6B7280'

    }).then(result => {

      if (!result.isConfirmed) {

        return;

      }


      this.publishing = true;


      this.resultService
        .createCoordinatorResult({

          event_id:
            this.selectedEventId!,

          student_id:
            this.selectedStudentId!,

          position:
            this.selectedPosition,

          remarks:
            this.remarks || null

        })
        .subscribe({

          next: (response: any) => {

            console.log(
              'RESULT PUBLISHED:',
              response
            );


            this.publishing = false;


            Swal.fire({

              icon: 'success',

              title: 'Result Published',

              text:
                response.message ||
                'Result published successfully.',

              timer: 1500,

              showConfirmButton: false

            });


            this.resetForm();

            this.loadResults();

          },


          error: (error) => {

            console.error(
              'PUBLISH RESULT ERROR:',
              error
            );


            this.publishing = false;


            Swal.fire({

              icon: 'error',

              title: 'Failed',

              text:
                error.error?.message ||
                'Unable to publish result.',

              confirmButtonColor: '#DC2626'

            });

          }

        });

    });

  }


  // =====================================================
  // DELETE RESULT
  // =====================================================

  deleteResult(
    result: any
  ): void {

    Swal.fire({

      icon: 'warning',

      title: 'Delete Result?',

      text:
        `Remove the result for ${result.student?.name || 'this student'}?`,

      showCancelButton: true,

      confirmButtonText: 'Yes, Delete',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#DC2626',

      cancelButtonColor: '#6B7280'

    }).then(response => {

      if (!response.isConfirmed) {

        return;

      }


      this.resultService
        .deleteCoordinatorResult(
          result.id
        )
        .subscribe({

          next: (res: any) => {

            Swal.fire({

              icon: 'success',

              title: 'Deleted',

              text:
                res.message ||
                'Result deleted successfully.',

              timer: 1500,

              showConfirmButton: false

            });

            this.loadResults();

          },

          error: (error) => {

            console.error(
              'DELETE RESULT ERROR:',
              error
            );

            Swal.fire({

              icon: 'error',

              title: 'Failed',

              text:
                error.error?.message ||
                'Unable to delete result.',

              confirmButtonColor: '#DC2626'

            });

          }

        });

    });

  }


  // =====================================================
  // POSITION LABEL
  // =====================================================

  getPositionLabel(
    position: string
  ): string {

    switch (position) {

      case 'First':
        return '🥇 First Place';

      case 'Second':
        return '🥈 Second Place';

      case 'Third':
        return '🥉 Third Place';

      case 'Participation':
        return 'Participation';

      default:
        return position;

    }

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  resetForm(): void {

    this.selectedStudentId = null;

    this.selectedPosition = '';

    this.remarks = '';

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.loadEvents();

    this.loadResults();

    if (this.selectedEventId) {

      this.loadParticipants(
        this.selectedEventId
      );

    }

  }

}