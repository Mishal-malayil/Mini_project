import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-selection',
  standalone: true,
  templateUrl: './login-selection.html',
  styleUrl: './login-selection.css'
})
export class LoginSelection {

  constructor(private router: Router) {}

  goToLogin(type: string): void {

    if (type === 'admin') {
      this.router.navigate(['/login']);
    }

    else if (type === 'coordinator') {
      this.router.navigate(['/coordinator/login']);
    }

    else if (type === 'student') {
      this.router.navigate(['/student/login']);
    }

  }
}