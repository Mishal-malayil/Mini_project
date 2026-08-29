import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { RegistrationService } from '../../../core/services/registration';

@Component({
  selector: 'app-coordinator-registrations',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './registrations.html',
  styleUrl: './registrations.css'
})
export class CoordinatorRegistrations implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  registrations: any[] = [];

  filteredRegistrations: any[] = [];

  events: any[] = [];

  loading = false;


  // =====================================================
  // SEARCH & FILTER
  // =====================================================

  searchText = '';

  selectedEvent = '';

  selectedStatus = '';


  // =====================================================
  // COUNTS
  // =====================================================

  totalRegistrations = 0;

  pendingCount = 0;

  approvedCount = 0;

  rejectedCount = 0;


  constructor(
    private registrationService: RegistrationService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    this.loadRegistrations();

  }


  // =====================================================
  // LOAD COORDINATOR REGISTRATIONS
  // =====================================================

  loadRegistrations(): void {

    this.loading = true;

    this.registrationService
      .getCoordinatorRegistrations()
      .subscribe({

        next: (response: any) => {

          console.log(
            'COORDINATOR REGISTRATIONS:',
            response
          );


          // Laravel returns array
          if (Array.isArray(response)) {

            this.registrations = response;

          }

          // Laravel returns { data: [...] }
          else if (Array.isArray(response.data)) {

            this.registrations =
              response.data;

          }

          else {

            this.registrations = [];

          }


          // Create event list
          this.createEventList();


          // Calculate counts
          this.calculateCounts();


          // Apply filters
          this.applyFilters();


          this.loading = false;

        },


        error: (error) => {

          console.error(
            'REGISTRATION ERROR:',
            error
          );

          this.registrations = [];

          this.filteredRegistrations = [];

          this.loading = false;


          Swal.fire({

            icon: 'error',

            title: 'Unable to Load Registrations',

            text:
              error.error?.message ||
              'Something went wrong.',

            confirmButtonColor: '#2563EB'

          });

        }

      });

  }


  // =====================================================
  // CREATE EVENT LIST
  // =====================================================

  createEventList(): void {

    const eventMap = new Map();

    this.registrations.forEach(
      (registration: any) => {

        const event =
          registration.event;

        if (event && !eventMap.has(event.id)) {

          eventMap.set(
            event.id,
            event
          );

        }

      }
    );

    this.events =
      Array.from(eventMap.values());

  }


  // =====================================================
  // CALCULATE COUNTS
  // =====================================================

  calculateCounts(): void {

    this.totalRegistrations =
      this.registrations.length;


    this.pendingCount =
      this.registrations.filter(
        registration =>
          registration.status === 'Pending'
      ).length;


    this.approvedCount =
      this.registrations.filter(
        registration =>
          registration.status === 'Approved'
      ).length;


    this.rejectedCount =
      this.registrations.filter(
        registration =>
          registration.status === 'Rejected'
      ).length;

  }


  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.filteredRegistrations =
      this.registrations.filter(
        (registration: any) => {


          // ---------------------------------------------
          // Student search
          // ---------------------------------------------

          const student =
            registration.student;

          const studentName =
            student?.name
              ?.toLowerCase() || '';

          const studentEmail =
            student?.email
              ?.toLowerCase() || '';

          const studentId =
            String(
              student?.id || ''
            ).toLowerCase();


          const matchesSearch =
            !search ||

            studentName.includes(search) ||

            studentEmail.includes(search) ||

            studentId.includes(search);


          // ---------------------------------------------
          // Event filter
          // ---------------------------------------------

          const matchesEvent =
            !this.selectedEvent ||

            String(
              registration.event_id
            ) ===
            String(
              this.selectedEvent
            );


          // ---------------------------------------------
          // Status filter
          // ---------------------------------------------

          const matchesStatus =
            !this.selectedStatus ||

            registration.status ===
            this.selectedStatus;


          return (
            matchesSearch &&
            matchesEvent &&
            matchesStatus
          );

        }
      );

  }


  // =====================================================
  // APPROVE REGISTRATION
  // =====================================================

  approveRegistration(
    registration: any
  ): void {

    Swal.fire({

      icon: 'question',

      title: 'Approve Registration?',

      text:
        `Approve ${registration.student?.name || 'this student'}?`,

      showCancelButton: true,

      confirmButtonText: 'Yes, Approve',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#16A34A',

      cancelButtonColor: '#6B7280'

    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }


      this.registrationService
        .approveCoordinatorRegistration(
          registration.id
        )
        .subscribe({

          next: (response: any) => {

            registration.status =
              'Approved';

            this.calculateCounts();

            this.applyFilters();


            Swal.fire({

              icon: 'success',

              title: 'Approved',

              text:
                response.message ||
                'Registration approved successfully.',

              confirmButtonColor: '#2563EB'

            });

          },


          error: (error) => {

            console.error(
              'APPROVE ERROR:',
              error
            );

            Swal.fire({

              icon: 'error',

              title: 'Failed',

              text:
                error.error?.message ||
                'Unable to approve registration.',

              confirmButtonColor: '#DC2626'

            });

          }

        });

    });

  }


  // =====================================================
  // REJECT REGISTRATION
  // =====================================================

  rejectRegistration(
    registration: any
  ): void {

    Swal.fire({

      icon: 'warning',

      title: 'Reject Registration?',

      text:
        `Reject ${registration.student?.name || 'this student'}?`,

      showCancelButton: true,

      confirmButtonText: 'Yes, Reject',

      cancelButtonText: 'Cancel',

      confirmButtonColor: '#DC2626',

      cancelButtonColor: '#6B7280'

    }).then(result => {

      if (!result.isConfirmed) {
        return;
      }


      this.registrationService
        .rejectCoordinatorRegistration(
          registration.id
        )
        .subscribe({

          next: (response: any) => {

            registration.status =
              'Rejected';

            this.calculateCounts();

            this.applyFilters();


            Swal.fire({

              icon: 'success',

              title: 'Rejected',

              text:
                response.message ||
                'Registration rejected successfully.',

              confirmButtonColor: '#2563EB'

            });

          },


          error: (error) => {

            console.error(
              'REJECT ERROR:',
              error
            );

            Swal.fire({

              icon: 'error',

              title: 'Failed',

              text:
                error.error?.message ||
                'Unable to reject registration.',

              confirmButtonColor: '#DC2626'

            });

          }

        });

    });

  }


  // =====================================================
  // VIEW REGISTRATION
  // =====================================================

  viewRegistration(
    registration: any
  ): void {

    Swal.fire({

      title: 'Registration Details',

      html: `

        <div style="text-align:left">

          <p>
            <strong>Student:</strong>
            ${registration.student?.name || 'N/A'}
          </p>

          <p>
            <strong>Student ID:</strong>
            ${registration.student?.id || 'N/A'}
          </p>

          <p>
            <strong>Email:</strong>
            ${registration.student?.email || 'N/A'}
          </p>

          <p>
            <strong>Event:</strong>
            ${registration.event?.event_name || 'N/A'}
          </p>

          <p>
            <strong>Registration Date:</strong>
            ${registration.registration_date || 'N/A'}
          </p>

          <p>
            <strong>Status:</strong>
            ${registration.status || 'N/A'}
          </p>

        </div>

      `,

      confirmButtonText: 'Close',

      confirmButtonColor: '#2563EB'

    });

  }


  // =====================================================
  // RESET FILTERS
  // =====================================================

  resetFilters(): void {

    this.searchText = '';

    this.selectedEvent = '';

    this.selectedStatus = '';

    this.applyFilters();

  }

}