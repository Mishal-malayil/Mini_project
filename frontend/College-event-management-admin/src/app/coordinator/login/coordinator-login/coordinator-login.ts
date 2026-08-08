import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { CoordinatorService } from '../../../core/services/coordinator'
@Component({
  selector: 'app-coordinator-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './coordinator-login.html',
  styleUrl: './coordinator-login.css'
})
export class CoordinatorLogin {

  loading = false;

  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private coordinatorService: CoordinatorService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        Validators.required
      ]

    });
  }

  login(): void {

    // Check form validation
    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password
    };

    this.coordinatorService.login(loginData).subscribe({

      next: (response: any) => {

        this.loading = false;

        // Save token
        this.coordinatorService.saveToken(
          response.token
        );

        // Save coordinator details
        this.coordinatorService.saveCoordinator(
          response.coordinator
        );

        // Success message
        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome ${response.coordinator.name}`,
          confirmButtonColor: '#2563EB',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {

          // Go to coordinator dashboard
          this.router.navigate([
            '/coordinator/dashboard'
          ]);

        });

      },

      error: (error: any) => {

        this.loading = false;

        console.log(
          'Coordinator Login Error:',
          error
        );

        if (error.status === 401) {

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid email or password.',
            confirmButtonColor: '#DC2626'
          });

        }
        else if (error.status === 422) {

          Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please enter a valid email and password.',
            confirmButtonColor: '#F59E0B'
          });

        }
        else {

          Swal.fire({
            icon: 'error',
            title: 'Something Went Wrong',
            text: 'Unable to login. Please try again.',
            confirmButtonColor: '#DC2626'
          });

        }

      }

    });

  }

}