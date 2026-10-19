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

  // Student login
  loginForm: any;
  loading = false;

  // Forgot password modal
  showForgotPassword = false;
  resetStep = 1;

  resetEmail = '';
  resetOtp = '';

  resetLoading = false;
  verifyLoading = false;
  passwordResetLoading = false;

  // New password form
  resetPasswordForm: any;

  constructor(
    private fb: FormBuilder,
    private authService: StudentAuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.nonNullable.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', Validators.required]
    });

    this.resetPasswordForm = this.fb.nonNullable.group({
      new_password: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      new_password_confirmation: ['', [
        Validators.required
      ]]
    });
  }

  // Login form getters
  get email() {
    return this.loginForm.controls.email;
  }

  get password() {
    return this.loginForm.controls.password;
  }

  // ==========================================
  // STUDENT LOGIN
  // ==========================================

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.login(
      this.loginForm.getRawValue()
    ).subscribe({
      next: (response: any) => {
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

        this.router.navigate(['/student/dashboard']);
      },

      error: (error: any) => {
        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: error.error?.message ||
            'Invalid email or password.'
        });
      }
    });
  }

  // ==========================================
  // OPEN FORGOT PASSWORD MODAL
  // ==========================================

  openForgotPassword(): void {
    this.showForgotPassword = true;
    this.resetStep = 1;

    this.resetEmail = '';
    this.resetOtp = '';

    this.resetLoading = false;
    this.verifyLoading = false;
    this.passwordResetLoading = false;

    this.resetPasswordForm.reset();
  }

  // ==========================================
  // CLOSE FORGOT PASSWORD MODAL
  // ==========================================

  closeForgotPassword(): void {
    this.showForgotPassword = false;
    this.resetStep = 1;

    this.resetEmail = '';
    this.resetOtp = '';

    this.resetLoading = false;
    this.verifyLoading = false;
    this.passwordResetLoading = false;

    this.resetPasswordForm.reset();
  }

  // ==========================================
  // CHANGE EMAIL
  // ==========================================

  changeResetEmail(): void {
    this.resetStep = 1;
    this.resetOtp = '';

    this.resetPasswordForm.reset();
  }

  // ==========================================
  // STEP 1: GENERATE OTP
  // ==========================================

  sendOtp(): void {
    const email = this.resetEmail
      .trim()
      .toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Email',
        text: 'Please enter a valid email address.'
      });

      return;
    }

    this.resetEmail = email;
    this.resetLoading = true;

    this.authService.forgotPassword(email).subscribe({
      next: (response: any) => {
        this.resetLoading = false;
        this.resetStep = 2;

        Swal.fire({
          icon: 'success',
          title: 'OTP Requested',
          text: response?.message ||
            'If the email is registered, an OTP has been generated.'
        });
      },

      error: (error: any) => {
        this.resetLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'OTP Request Failed',
          text: error.error?.message ||
            'Unable to process your request. Please try again.'
        });
      }
    });
  }

  // ==========================================
  // STEP 2: VERIFY OTP
  // ==========================================

  verifyOtp(): void {
    const otp = this.resetOtp.trim();

    if (!/^\d{6}$/.test(otp)) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'Please enter the six-digit OTP.'
      });

      return;
    }

    this.resetOtp = otp;
    this.verifyLoading = true;

    this.authService.verifyResetOtp(
      this.resetEmail,
      otp
    ).subscribe({
      next: (response: any) => {
        this.verifyLoading = false;
        this.resetStep = 3;

        Swal.fire({
          icon: 'success',
          title: 'OTP Verified',
          text: response?.message ||
            'OTP verified successfully.',
          timer: 1200,
          showConfirmButton: false
        });
      },

      error: (error: any) => {
        this.verifyLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'OTP Verification Failed',
          text: error.error?.message ||
            'Invalid or expired OTP. Please try again.'
        });
      }
    });
  }

  // ==========================================
  // STEP 3: RESET PASSWORD
  // ==========================================

  resetPassword(): void {
    if (this.resetPasswordForm.invalid) {
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    const values = this.resetPasswordForm.getRawValue();

    if (
      values.new_password !==
      values.new_password_confirmation
    ) {
      Swal.fire({
        icon: 'warning',
        title: 'Passwords Do Not Match',
        text: 'Please enter the same password in both fields.'
      });

      return;
    }

    this.passwordResetLoading = true;

    this.authService.resetPassword({
      email: this.resetEmail,
      otp: this.resetOtp,
      new_password: values.new_password,
      new_password_confirmation:
        values.new_password_confirmation
    }).subscribe({
      next: (response: any) => {
        this.passwordResetLoading = false;

        this.closeForgotPassword();

        // Clear the local student session
        localStorage.removeItem('student_token');
        localStorage.removeItem('student');

        Swal.fire({
          icon: 'success',
          title: 'Password Reset Successful',
          text: response?.message ||
            'Please log in with your new password.'
        });
      },

      error: (error: any) => {
        this.passwordResetLoading = false;

        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: error.error?.message ||
            'Unable to reset your password. Please try again.'
        });
      }
    });
  }
}