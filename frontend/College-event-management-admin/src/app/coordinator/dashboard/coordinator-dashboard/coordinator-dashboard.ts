import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CoordinatorService } from '../../../core/services/coordinator';

@Component({
  selector: 'app-coordinator-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coordinator-dashboard.html',
  styleUrl: './coordinator-dashboard.css'
})
export class CoordinatorDashboard {

  coordinator: any;

  constructor(
    private router: Router,
    private coordinatorService: CoordinatorService
  ) {

    this.coordinator =
      this.coordinatorService.getCoordinatorData();

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