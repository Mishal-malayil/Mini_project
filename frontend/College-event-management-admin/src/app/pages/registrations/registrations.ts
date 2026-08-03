import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegistrationService } from '../../core/services/registration';

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

  selectedRegistration: any = {};

  constructor(
    private registrationService: RegistrationService
  ) { }

  ngOnInit(): void {

    this.loadRegistrations();

  }

  // Load All Registrations

  loadRegistrations() {

    this.registrationService.getRegistrations().subscribe({

      next: (res: any) => {

        this.registrations = res;

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