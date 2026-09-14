import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  student: any = null;

  studentName = 'Student';
  initials = '';

  notificationCount = 0;

  searchOpen = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudent();
  }

  // ==============================
  // LOAD STUDENT
  // ==============================

  loadStudent(): void {

    const studentData = localStorage.getItem('student');

    if (!studentData) {
      this.student = null;
      this.studentName = 'Student';
      this.initials = 'S';
      return;
    }

    try {

      this.student = JSON.parse(studentData);

      this.studentName =
        this.student?.name?.trim() || 'Student';

      this.initials =
        this.getInitials(this.studentName);

    } catch (error) {

      console.error(
        'Error loading student:',
        error
      );

      this.student = null;
      this.studentName = 'Student';
      this.initials = 'S';

    }
  }

  // ==============================
  // GET INITIALS
  // ==============================

  getInitials(name: string): string {

    if (!name) {
      return 'S';
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {

      return words[0]
        .charAt(0)
        .toUpperCase();

    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();

  }

  // ==============================
  // TOGGLE SEARCH
  // ==============================

  toggleSearch(): void {

    this.searchOpen =
      !this.searchOpen;

  }

  // ==============================
  // CLOSE SEARCH
  // ==============================

  closeSearch(): void {

    this.searchOpen = false;

  }

  // ==============================
  // NOTIFICATIONS
  // ==============================

  openNotifications(): void {

    this.router.navigate([
      '/student/notifications'
    ]);

  }

  // ==============================
  // PROFILE
  // ==============================

  openProfile(): void {

    this.router.navigate([
      '/student/profile'
    ]);

  }

  // ==============================
  // LOGOUT
  // ==============================


logout(): void {

  Swal.fire({
    icon: 'question',
    title: 'Logout?',
    text: 'Are you sure you want to logout from your student account?',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    allowOutsideClick: false
  }).then((result) => {

    if (result.isConfirmed) {

      // Remove student login data
      localStorage.removeItem('student');
      localStorage.removeItem('student_token');
      localStorage.removeItem('token');

      this.student = null;

      // Show logout success message
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {

        // Go to student login
        this.router.navigate(['/student/login']);

      });

    }

  });
}



}