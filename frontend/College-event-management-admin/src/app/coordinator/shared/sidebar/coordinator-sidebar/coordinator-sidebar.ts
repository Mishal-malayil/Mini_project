import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-coordinator-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './coordinator-sidebar.html',
  styleUrl: './coordinator-sidebar.css'
})
export class CoordinatorSidebar {

  coordinator: any = {}; 

  constructor(private router: Router) {}
  ngOnInit(): void {

    const storedCoordinator = localStorage.getItem('coordinator');

    if (storedCoordinator) {
      this.coordinator = JSON.parse(storedCoordinator);
    }

  } 

  logout(): void {

    localStorage.removeItem('coordinator');
    localStorage.removeItem('coordinator_token');

    this.router.navigate(['/coordinator/login']);

  }

}