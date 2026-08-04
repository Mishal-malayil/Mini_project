import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  errorMessage = '';
  loading = false;
  loginForm: ReturnType<FormBuilder['group']>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login() {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loading = true;
  this.errorMessage = '';

  this.authService.login(this.loginForm.value).subscribe({

    next: (response) => {

      this.authService.saveToken(response.token);
      this.authService.saveAdmin(response.admin);

      this.loading = false;

      Swal.fire({
        icon: 'success',
        title: 'Login Successful!',
        text: 'Welcome to College Event Management System',
        confirmButtonColor: '#2563EB',
        timer: 1800,
        showConfirmButton: false
      }).then(() => {

        this.router.navigate(['/dashboard']);

      });

    },

    error: (error) => {

      this.loading = false;

      Swal.fire({
        icon: 'error',
        title: 'Login Failed',
        text: error.status === 401
          ? 'Invalid Email or Password'
          : 'Something went wrong',
        confirmButtonColor: '#DC2626'
      });

    }

  });
}
}
