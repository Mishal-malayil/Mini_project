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

  registrations: any[] = [];
  filteredRegistrations: any[] = [];

  selectedRegistration: any = {};

  constructor(
    private registrationService: RegistrationService,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {

    this.loadRegistrations();
     this.searchService.search$.subscribe(text => {

    console.log("Search:", text);

    this.filteredRegistrations = this.registrations.filter(registration =>

      registration.student?.name.toLowerCase().includes(text.toLowerCase()) ||

      registration.student?.email.toLowerCase().includes(text.toLowerCase()) ||

      registration.event?.event_name.toLowerCase().includes(text.toLowerCase()) ||

      registration.status.toLowerCase().includes(text.toLowerCase())

    );

  });
  }

  // Load All Registrations

  loadRegistrations() {

    this.registrationService.getRegistrations().subscribe({

      next: (res: any) => {

        this.registrations = res;
        this.filteredRegistrations = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // View Registration

  viewRegistration(id: number) {

    this.registrationService.getRegistration(id).subscribe({

      next: (res: any) => {

        this.selectedRegistration = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

}