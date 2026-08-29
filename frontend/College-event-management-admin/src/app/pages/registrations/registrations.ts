import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegistrationService } from '../../core/services/registration';
import { SearchService } from '../../core/services/search';

@Component({
  selector: 'app-registrations',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './registrations.html',
  styleUrl: './registrations.css'
})
export class Registrations implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  registrations: any[] = [];

  filteredRegistrations: any[] = [];

  selectedRegistration: any = {};


  constructor(
    private registrationService: RegistrationService,
    private searchService: SearchService
  ) {}


  // =====================================================
  // INITIALIZE
  // =====================================================

  ngOnInit(): void {

    // Load ALL registrations
    this.loadRegistrations();


    // Search from admin navbar/search service
    this.searchService.search$.subscribe(text => {

      console.log('Admin Search:', text);

      this.applySearch(text);

    });

  }


  // =====================================================
  // LOAD ALL REGISTRATIONS
  // =====================================================

  loadRegistrations(): void {

    console.log('Loading ALL registrations...');


    this.registrationService
      .getRegistrations()
      .subscribe({

        next: (res: any) => {

          console.log(
            'ADMIN REGISTRATIONS:',
            res
          );


          // Laravel returns array
          if (Array.isArray(res)) {

            this.registrations = res;

          }

          // Laravel returns { data: [...] }
          else if (Array.isArray(res?.data)) {

            this.registrations = res.data;

          }

          else {

            this.registrations = [];

          }


          // Show all registrations initially
          this.filteredRegistrations = [
            ...this.registrations
          ];


          console.log(
            'TOTAL REGISTRATIONS:',
            this.registrations.length
          );

        },


        error: (err) => {

          console.error(
            'ADMIN REGISTRATION ERROR:',
            err
          );

          this.registrations = [];

          this.filteredRegistrations = [];

        }

      });

  }


  // =====================================================
  // SEARCH
  // =====================================================

  applySearch(text: string): void {

    const search =
      (text || '')
        .trim()
        .toLowerCase();


    // Empty search → show everything
    if (!search) {

      this.filteredRegistrations = [
        ...this.registrations
      ];

      return;

    }


    this.filteredRegistrations =
      this.registrations.filter(
        (registration: any) => {

          const studentName =
            registration.student?.name
              ?.toLowerCase() || '';


          const studentEmail =
            registration.student?.email
              ?.toLowerCase() || '';


          const eventName =
            registration.event?.event_name
              ?.toLowerCase() || '';


          const status =
            registration.status
              ?.toLowerCase() || '';


          return (

            studentName.includes(search) ||

            studentEmail.includes(search) ||

            eventName.includes(search) ||

            status.includes(search)

          );

        }
      );

  }


  // =====================================================
  // VIEW REGISTRATION
  // =====================================================

  viewRegistration(id: number): void {

    this.registrationService
      .getRegistration(id)
      .subscribe({

        next: (res: any) => {

          console.log(
            'REGISTRATION DETAILS:',
            res
          );

          this.selectedRegistration = res;

        },

        error: (err) => {

          console.error(
            'VIEW REGISTRATION ERROR:',
            err
          );

        }

      });

  }

}