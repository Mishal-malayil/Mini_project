import { Component, OnInit } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar implements OnInit {

  student: any = null;

  studentName = 'Student';

  initials = 'S';


  ngOnInit(): void {

    this.loadStudent();

  }


  // ==============================
  // LOAD STUDENT
  // ==============================

  loadStudent(): void {

    const studentData =
      localStorage.getItem('student');

    if (!studentData) {

      this.student = null;

      this.studentName = 'Student';

      this.initials = 'S';

      return;

    }


    try {

      this.student =
        JSON.parse(studentData);

      this.studentName =
        this.student?.name?.trim()
        || 'Student';

      this.initials =
        this.getInitials(
          this.studentName
        );

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
  // INITIALS
  // ==============================

  getInitials(
    name: string
  ): string {

    if (!name) {
      return 'S';
    }

    const words =
      name
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
      words[words.length - 1]
        .charAt(0)
    ).toUpperCase();

  }

}