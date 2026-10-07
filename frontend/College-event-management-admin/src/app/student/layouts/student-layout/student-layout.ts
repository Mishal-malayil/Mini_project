import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Navbar } from '../../../student/shared/navbar/navbar/navbar';
import { Sidebar } from '../../../student/shared/sidebar/sidebar/sidebar';

@Component({
  selector: 'app-student-layout',
  standalone: true,
  imports: [ RouterOutlet,Navbar,Sidebar],
  templateUrl: './student-layout.html',
  styleUrl: './student-layout.css'
})
export class StudentLayout {}