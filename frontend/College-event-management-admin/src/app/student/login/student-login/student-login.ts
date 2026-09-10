import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { StudentAuthService } from '../../../core/services/student-auth';

@Component({
  selector: 'app-student-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './student-login.html',
  styleUrl: './student-login.css'
})
export class StudentLogin {

  // Declare only
  loginForm: any;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: StudentAuthService,
    private router: Router
  ) {

    // Create form AFTER fb is initialized
    this.loginForm = this.fb.nonNullable.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required
        ]
      ]

    });
  }

  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  login() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    this.authService
      .login(this.loginForm.getRawValue())
      .subscribe({

        next: (response: any) => {

          console.log('Login Response:', response);

          localStorage.setItem(
            'student_token',
            response.token
          );

          localStorage.setItem(
            'student',
            JSON.stringify(response.student)
          );

          this.loading = false;

          Swal.fire({
            icon: 'success',
            title: 'Login Successful',
            text: 'Welcome back!',
            timer: 1500,
            showConfirmButton: false
          });

          this.router.navigate([
            '/student/dashboard'
          ]);
        },

        error: (error) => {

          console.error('Login Error:', error);

          this.loading = false;

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text:
              error.error?.message ||
              'Invalid email or password'
          });
        }

      });
  }
}