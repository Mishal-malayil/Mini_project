import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoordinatorService } from '../../../core/services/coordinator';
import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coordinator-dashboard.html',
  styleUrl: './coordinator-dashboard.css'
})
export class CoordinatorDashboard {

  coordinator: any;

  // Dashboard statistics
  dashboardData: any = {
    total_events: 0,
    total_registrations: 0,
    total_attendance: 0,
    total_results: 0
  };


  constructor(
    private router: Router,
    private coordinatorService: CoordinatorService,
    private eventService: EventService
  ) {

    this.coordinator =
      this.coordinatorService.getCoordinatorData();

    this.loadDashboard();

  }


  loadDashboard(): void {

  this.eventService.getCoordinatorDashboard().subscribe({

    next: (response: any) => {

      console.log('Dashboard Data:', response);

      this.dashboardData = {
        total_events: response?.total_events ?? 0,
        total_registrations: response?.total_registrations ?? 0,
        total_attendance: response?.total_attendance ?? 0,
        total_results: response?.total_results ?? 0
      };

    },

    error: (error) => {

      console.error('Dashboard Error:', error);

      this.dashboardData = {
        total_events: 0,
        total_registrations: 0,
        total_attendance: 0,
        total_results: 0
      };

    }

  });
}


  goToEvents() {

    this.router.navigate([
      '/coordinator/events'
    ]);

  }


  goToRegistrations() {

    this.router.navigate([
      '/coordinator/registrations'
    ]);

  }


  goToAttendance() {

    this.router.navigate([
      '/coordinator/attendance'
    ]);

  }


  goToResults() {

    this.router.navigate([
      '/coordinator/results'
    ]);

  }


  goToAnnouncements() {

    this.router.navigate([
      '/coordinator/announcements'
    ]);

  }


  logout() {

    this.coordinatorService.logout();

    this.router.navigate([
      '/coordinator/login'
    ]);

  }

}