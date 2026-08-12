import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { CoordinatorSidebar } from '../../shared/sidebar/coordinator-sidebar/coordinator-sidebar';
import { CoordinatorNavbar } from '../../shared/navbar/coordinator-navbar/coordinator-navbar';

@Component({
  selector: 'app-coordinator-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    CoordinatorSidebar,
    CoordinatorNavbar
  ],
  templateUrl: './coordinator-layout.html',
  styleUrl: './coordinator-layout.css'
})
export class CoordinatorLayout {

}