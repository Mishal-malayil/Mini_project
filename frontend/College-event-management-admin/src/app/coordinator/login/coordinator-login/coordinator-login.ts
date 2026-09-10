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

import { CoordinatorService } from '../../../core/services/coordinator';

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

  // =========================
  // FORGOT PASSWORD
  // =========================

  showForgotPassword = false;

  resetStep = 1;

  resetEmail = '';
  resetOtp = '';

  resetLoading = false;
  verifyLoading = false;
  passwordResetLoading = false;

  resetPasswordForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private coordinatorService: CoordinatorService,
    private router: Router
  ) {

    // Login form
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

    // Reset password form
    this.resetPasswordForm = this.fb.group({

      new_password: [
        '',
        [
          Validators.required,
          Validators.minLength(8)
        ]
      ],

      new_password_confirmation: [
        '',
        Validators.required
      ]

    });

  }


  // =========================
  // LOGIN
  // =========================

  login(): void {

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

        Swal.fire({
          icon: 'success',
          title: 'Login Successful!',
          text: `Welcome ${response.coordinator.name}`,
          confirmButtonColor: '#2563EB',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {

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


  // =========================
  // OPEN FORGOT PASSWORD
  // =========================

  openForgotPassword(): void {

    this.showForgotPassword = true;

    this.resetStep = 1;

    this.resetEmail = '';
    this.resetOtp = '';

    this.resetPasswordForm.reset();

  }


  // =========================
  // CLOSE MODAL
  // =========================

  closeForgotPassword(): void {

    this.showForgotPassword = false;

    this.resetStep = 1;

    this.resetEmail = '';
    this.resetOtp = '';

    this.resetPasswordForm.reset();

  }


  // =========================
  // SEND OTP
  // =========================

  sendOtp(): void {

    if (!this.resetEmail) {

      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your registered email address.',
        confirmButtonColor: '#F59E0B'
      });

      return;
    }

    // Basic email validation
    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.resetEmail)) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.',
        confirmButtonColor: '#F59E0B'
      });

      return;
    }

    this.resetLoading = true;

    this.coordinatorService
      .forgotCoordinatorPassword(this.resetEmail)
      .subscribe({

        next: (response: any) => {

          this.resetLoading = false;

          this.resetStep = 2;

          Swal.fire({
            icon: 'success',
            title: 'OTP Sent',
            text: response?.message ||
              'OTP has been sent to your email.',
            confirmButtonColor: '#2563EB'
          });

        },

        error: (error: any) => {

          this.resetLoading = false;

          console.log(
            'Forgot Password Error:',
            error
          );

          Swal.fire({
            icon: 'error',
            title: 'Unable to Send OTP',
            text:
              error?.error?.message ||
              'Unable to send OTP. Please try again.',
            confirmButtonColor: '#DC2626'
          });

        }

      });

  }


  // =========================
  // VERIFY OTP
  // =========================

  verifyOtp(): void {

    if (!this.resetOtp) {

      Swal.fire({
        icon: 'warning',
        title: 'OTP Required',
        text: 'Please enter the OTP.',
        confirmButtonColor: '#F59E0B'
      });

      return;
    }

    if (!/^\d{6}$/.test(this.resetOtp)) {

      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'OTP must contain 6 digits.',
        confirmButtonColor: '#F59E0B'
      });

      return;
    }

    this.verifyLoading = true;

    this.coordinatorService
      .verifyCoordinatorResetOtp(
        this.resetEmail,
        this.resetOtp
      )
      .subscribe({

        next: (response: any) => {

          this.verifyLoading = false;

          this.resetStep = 3;

          Swal.fire({
            icon: 'success',
            title: 'OTP Verified',
            text:
              response?.message ||
              'OTP verified successfully.',
            confirmButtonColor: '#2563EB',
            timer: 1200,
            showConfirmButton: false
          });

        },

        error: (error: any) => {

          this.verifyLoading = false;

          console.log(
            'OTP Verification Error:',
            error
          );

          Swal.fire({
            icon: 'error',
            title: 'Invalid OTP',
            text:
              error?.error?.message ||
              'Invalid or expired OTP.',
            confirmButtonColor: '#DC2626'
          });

        }

      });

  }


  // =========================
  // RESET PASSWORD
  // =========================

  resetPassword(): void {

    if (this.resetPasswordForm.invalid) {

      this.resetPasswordForm.markAllAsTouched();

      return;
    }

    const newPassword =
      this.resetPasswordForm.value.new_password;

    const confirmPassword =
      this.resetPasswordForm.value.new_password_confirmation;

    if (newPassword !== confirmPassword) {

      Swal.fire({
        icon: 'warning',
        title: 'Passwords Do Not Match',
        text: 'Please make sure both passwords are the same.',
        confirmButtonColor: '#F59E0B'
      });

      return;
    }

    this.passwordResetLoading = true;

    const data = {

      email: this.resetEmail,

      new_password: newPassword,

      new_password_confirmation: confirmPassword

    };

    this.coordinatorService
      .resetCoordinatorPassword(data)
      .subscribe({

        next: (response: any) => {

          this.passwordResetLoading = false;

          Swal.fire({
            icon: 'success',
            title: 'Password Reset Successful',
            text:
              response?.message ||
              'Your password has been reset successfully.',
            confirmButtonColor: '#2563EB'
          }).then(() => {

            this.closeForgotPassword();

          });

        },

        error: (error: any) => {

          this.passwordResetLoading = false;

          console.log(
            'Password Reset Error:',
            error
          );

          Swal.fire({
            icon: 'error',
            title: 'Password Reset Failed',
            text:
              error?.error?.message ||
              'Unable to reset password. Please try again.',
            confirmButtonColor: '#DC2626'
          });

        }

      });

  }

}