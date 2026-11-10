
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

    if (this.loading) {
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Remove previous student session
    localStorage.removeItem('student_token');
    localStorage.removeItem('student');

    this.loading = true;

    const loginData = this.loginForm.getRawValue();

    // Normalize email
    loginData.email = loginData.email.trim().toLowerCase();

    this.authService.login(loginData).subscribe({

      next: (response: any) => {

        // Validate backend response
        if (
          !response ||
          typeof response.token !== 'string' ||
          !response.token.trim() ||
          !response.student ||
          typeof response.student !== 'object' ||
          Array.isArray(response.student)
        ) {

          this.loading = false;

          localStorage.removeItem('student_token');
          localStorage.removeItem('student');

          console.error(
            'Invalid student login response:',
            response
          );

          Swal.fire({
            icon: 'error',
            title: 'Login Failed',
            text: 'Invalid authentication response. Please try again.'
          });

          return;
        }

        // Save authenticated student session
        localStorage.setItem(
          'student_token',
          response.token
        );

        localStorage.setItem(
          'student',
          JSON.stringify(response.student)
        );

        this.loading = false;

        console.log('Student login successful');
        console.log('Student token saved:', true);
        console.log('Student data saved:', true);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: 'Welcome back!',
          timer: 1500,
          showConfirmButton: false
        }).then(() => {
          this.router.navigate(['/student/dashboard']);
        });

      },

      error: (error: any) => {

        this.loading = false;

        // Clear invalid session
        localStorage.removeItem('student_token');
        localStorage.removeItem('student');

        console.error('Student login error:', error);

        let errorMessage = 'Invalid email or password.';

        if (error.status === 401) {
          errorMessage = 'Invalid email or password.';
        } else if (error.status === 422) {
          errorMessage =
            error.error?.message || 'Please check your email and password.';
        } else if (error.status === 0) {
          errorMessage =
            'Unable to connect to the server. Please try again.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: errorMessage
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

    if (this.resetLoading) {
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

    if (this.verifyLoading) {
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

    if (this.passwordResetLoading) {
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

        // Clear student session
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
