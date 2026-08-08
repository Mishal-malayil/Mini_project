import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-coordinator-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLinkActive
  ],
  templateUrl: './coordinator-sidebar.html',
  styleUrl: './coordinator-sidebar.css'
})
export class CoordinatorSidebar {

  constructor(private router: Router) {}

  logout(): void {

    localStorage.removeItem('coordinator');
    localStorage.removeItem('coordinator_token');

    this.router.navigate(['/coordinator/login']);

  }

}