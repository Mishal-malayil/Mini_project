import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

import { StudentAuthService } from '../../../core/services/student-auth';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css'
})
export class MyProfile implements OnInit {

  student: any = null;

  loading = true;

  changePassword = {
  current_password: '',
  password: '',
  password_confirmation: ''
};

updatingPassword = false;

showCurrentPassword = false;
showNewPassword = false;
showConfirmPassword = false;

  constructor(
    private studentAuthService: StudentAuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    // First load student from localStorage
    const storedStudent = localStorage.getItem('student');

    if (storedStudent) {

      try {

        this.student = JSON.parse(storedStudent);

        console.log(
          'STUDENT FROM LOCAL STORAGE:',
          this.student
        );

      } catch (error) {

        console.error(
          'Invalid student data in localStorage',
          error
        );

      }

    }


    // Then get latest data from Laravel
    this.studentAuthService.getProfile().subscribe({

      next: (response: any) => {

        console.log(
          'PROFILE API RESPONSE:',
          response
        );


        // Support both:
        // { student: {...} }
        // and
        // {...student data...}

        if (response?.student) {

          this.student = response.student;

        } else if (response?.id) {

          this.student = response;

        }


        // Update localStorage with latest data
        if (this.student) {

          localStorage.setItem(
            'student',
            JSON.stringify(this.student)
          );

        }


        this.loading = false;

      },


      error: (error) => {

        console.error(
          'PROFILE API ERROR:',
          error
        );


        // If localStorage already gave us data,
        // still show the profile.
        if (this.student) {

          this.loading = false;

          return;

        }


        this.loading = false;


        if (error.status === 401) {

          localStorage.removeItem('student_token');
          localStorage.removeItem('student');

          this.router.navigate([
            '/student/login'
          ]);

          return;

        }


        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Profile',
          text:
            error.error?.message ||
            'Unable to load your profile.',
          confirmButtonColor: '#2563eb'
        });

      }

    });

  }


  // =====================================================
  // INITIALS
  // =====================================================

  getInitials(): string {

    if (!this.student?.name) {
      return 'S';
    }

    const name =
      this.student.name.trim();

    const parts =
      name.split(/\s+/);


    if (parts.length === 1) {

      return parts[0]
        .charAt(0)
        .toUpperCase();

    }


    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    Swal.fire({
      title: 'Logout?',
      text: 'Are you sure you want to logout?',
      icon: 'question',

      showCancelButton: true,

      confirmButtonText: 'Yes, Logout',
      cancelButtonText: 'Cancel',

      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',

      reverseButtons: true

    }).then((result) => {

      if (!result.isConfirmed) {
        return;
      }


      this.studentAuthService.logout().subscribe({

        next: () => {
          this.clearStudentSession();
        },

        error: () => {
          this.clearStudentSession();
        }

      });

    });

  }


  // =====================================================
  // CLEAR SESSION
  // =====================================================

  private clearStudentSession(): void {

    localStorage.removeItem(
      'student_token'
    );

    localStorage.removeItem(
      'student'
    );

    this.router.navigate([
      '/student/login'
    ]);

  }
//==================================================
//update password
//==================================================


updatePassword(): void {

  if (
    !this.changePassword.current_password ||
    !this.changePassword.password ||
    !this.changePassword.password_confirmation
  ) {
    Swal.fire({
      icon: 'warning',
      title: 'Incomplete Form',
      text: 'Please fill in all password fields.',
      confirmButtonColor: '#2563eb'
    });

    return;
  }


  if (this.changePassword.password.length < 8) {

    Swal.fire({
      icon: 'warning',
      title: 'Password Too Short',
      text: 'New password must contain at least 8 characters.',
      confirmButtonColor: '#2563eb'
    });

    return;
  }


  if (
    this.changePassword.password !==
    this.changePassword.password_confirmation
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Passwords Do Not Match',
      text: 'New password and confirmation password must match.',
      confirmButtonColor: '#2563eb'
    });

    return;
  }


  this.updatingPassword = true;


  this.studentAuthService
    .updatePassword(this.changePassword)
    .subscribe({

      next: (response: any) => {

        this.updatingPassword = false;


        Swal.fire({
          icon: 'success',
          title: 'Password Updated',
          text:
            response.message ||
            'Your password has been updated successfully.',
          confirmButtonColor: '#2563eb'
        }).then(() => {

          // Clear old session
          localStorage.removeItem('student_token');
          localStorage.removeItem('student');

          // Go to student login
          this.router.navigate([
            '/student/login'
          ]);

        });

      },


      error: (error) => {

        this.updatingPassword = false;

        console.error(
          'PASSWORD UPDATE ERROR:',
          error
        );


        let message =
          'Unable to update password.';


        if (error.error?.message) {

          message =
            error.error.message;

        }


        // Laravel validation errors
        if (
          error.error?.errors?.password
        ) {

          message =
            error.error.errors.password[0];

        }


        Swal.fire({
          icon: 'error',
          title: 'Password Update Failed',
          text: message,
          confirmButtonColor: '#dc2626'
        });

      }

    });

}

}