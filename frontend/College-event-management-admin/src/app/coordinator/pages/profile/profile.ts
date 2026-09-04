import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  coordinator: any = null;

  // Update password
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  // OTP reset password
  resetEmail = '';
  resetOtp = '';
  resetNewPassword = '';
  resetConfirmPassword = '';

  otpSent = false;
  otpVerified = false;

  isLoading = false;
  isUpdatingPassword = false;
  isSendingOtp = false;
  isVerifyingOtp = false;
  isResettingPassword = false;

  constructor(
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;

    this.authService.getCoordinatorProfile().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.coordinator = res;

        // Use coordinator email by default
        this.resetEmail = res?.email || '';
      },
      error: (err) => {
        this.isLoading = false;

        console.error('Profile error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Unable to load profile.',
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  // =========================================================
  // UPDATE PASSWORD
  // =========================================================

  updatePassword(): void {

    if (!this.currentPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Current Password Required',
        text: 'Please enter your current password.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (!this.newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'New Password Required',
        text: 'Please enter a new password.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (this.newPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'New password must contain at least 8 characters.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'New password and confirmation do not match.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (this.currentPassword === this.newPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Password',
        text: 'New password must be different from current password.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    this.isUpdatingPassword = true;

    const data = {
      current_password: this.currentPassword,
      new_password: this.newPassword,
      new_password_confirmation: this.confirmPassword
    };

    this.authService.updateCoordinatorPassword(data).subscribe({
      next: (res: any) => {

        this.isUpdatingPassword = false;

        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text: res?.message || 'Password updated successfully.',
          confirmButtonColor: '#2563EB'
        });

        this.clearPasswordForm();
      },

      error: (err) => {

        this.isUpdatingPassword = false;

        console.error('Password update error:', err);

        let message = 'Unable to update password.';

        if (err?.error?.errors) {

          const errors = err.error.errors;
          const messages: string[] = [];

          Object.keys(errors).forEach(key => {

            if (Array.isArray(errors[key])) {
              messages.push(...errors[key]);
            }

          });

          if (messages.length) {
            message = messages.join('\n');
          }

        } else if (err?.error?.message) {
          message = err.error.message;
        }

        Swal.fire({
          icon: 'error',
          title: 'Password Update Failed',
          text: message,
          confirmButtonColor: '#2563EB'
        });
      }
    });
  }

  clearPasswordForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }


  // =========================================================
  // FORGOT / RESET PASSWORD USING OTP
  // =========================================================

  sendResetOtp(): void {

    if (!this.resetEmail) {
      Swal.fire({
        icon: 'warning',
        title: 'Email Required',
        text: 'Please enter your email address.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    this.isSendingOtp = true;

    this.authService.forgotCoordinatorPassword(this.resetEmail).subscribe({

      next: (res: any) => {

        this.isSendingOtp = false;

        this.otpSent = true;
        this.otpVerified = false;

        Swal.fire({
          icon: 'success',
          title: 'OTP Sent',
          text: res?.message || 'OTP has been sent to your email.',
          confirmButtonColor: '#2563EB'
        });
      },

      error: (err) => {

        this.isSendingOtp = false;

        console.error('OTP error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Failed',
          text: err?.error?.message || 'Unable to send OTP.',
          confirmButtonColor: '#2563EB'
        });
      }

    });
  }


  verifyResetOtp(): void {

    if (!this.resetOtp) {
      Swal.fire({
        icon: 'warning',
        title: 'OTP Required',
        text: 'Please enter the OTP.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (this.resetOtp.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid OTP',
        text: 'OTP must contain 6 digits.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    this.isVerifyingOtp = true;

    this.authService.verifyCoordinatorResetOtp(
      this.resetEmail,
      this.resetOtp
    ).subscribe({

      next: (res: any) => {

        this.isVerifyingOtp = false;

        this.otpVerified = true;

        Swal.fire({
          icon: 'success',
          title: 'OTP Verified',
          text: res?.message || 'OTP verified successfully.',
          confirmButtonColor: '#2563EB'
        });
      },

      error: (err) => {

        this.isVerifyingOtp = false;

        console.error('OTP verification error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Invalid OTP',
          text: err?.error?.message || 'OTP verification failed.',
          confirmButtonColor: '#2563EB'
        });
      }

    });
  }


  resetPassword(): void {

    if (!this.otpVerified) {
      Swal.fire({
        icon: 'warning',
        title: 'OTP Verification Required',
        text: 'Please verify the OTP first.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (!this.resetNewPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'New Password Required',
        text: 'Please enter a new password.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (this.resetNewPassword.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Weak Password',
        text: 'Password must contain at least 8 characters.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    if (this.resetNewPassword !== this.resetConfirmPassword) {
      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match.',
        confirmButtonColor: '#2563EB'
      });
      return;
    }

    this.isResettingPassword = true;

    const data = {
      email: this.resetEmail,
      new_password: this.resetNewPassword,
      new_password_confirmation: this.resetConfirmPassword
    };

    this.authService.resetCoordinatorPassword(data).subscribe({

      next: (res: any) => {

        this.isResettingPassword = false;

        Swal.fire({
          icon: 'success',
          title: 'Password Reset',
          text: res?.message || 'Password reset successfully.',
          confirmButtonColor: '#2563EB'
        });

        this.clearResetForm();
      },

      error: (err) => {

        this.isResettingPassword = false;

        console.error('Password reset error:', err);

        Swal.fire({
          icon: 'error',
          title: 'Password Reset Failed',
          text: err?.error?.message || 'Unable to reset password.',
          confirmButtonColor: '#2563EB'
        });
      }

    });
  }


  clearResetForm(): void {

    this.resetEmail = this.coordinator?.email || '';
    this.resetOtp = '';
    this.resetNewPassword = '';
    this.resetConfirmPassword = '';

    this.otpSent = false;
    this.otpVerified = false;
  }
}