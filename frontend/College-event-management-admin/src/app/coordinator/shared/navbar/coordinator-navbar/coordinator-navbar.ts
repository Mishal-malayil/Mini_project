import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coordinator-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './coordinator-navbar.html',
  styleUrl: './coordinator-navbar.css'
})
export class CoordinatorNavbar implements OnInit {

  coordinator: any = {};

  constructor(private router: Router) {}

  ngOnInit(): void {

    const storedCoordinator = localStorage.getItem('coordinator');

    if (storedCoordinator) {
      this.coordinator = JSON.parse(storedCoordinator);
    }

  }

  logout(): void {

    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#2563EB',
      cancelButtonColor: '#DC2626',
      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel'
    }).then((result) => {

      if (result.isConfirmed) {

        localStorage.removeItem('coordinator');
        localStorage.removeItem('coordinator_token');

        Swal.fire({
          icon: 'success',
          title: 'Logged Out',
          text: 'You have been logged out successfully.',
          timer: 1200,
          showConfirmButton: false
        }).then(() => {

          this.router.navigate(['/coordinator/login']);

        });

      }

    });

  }

}