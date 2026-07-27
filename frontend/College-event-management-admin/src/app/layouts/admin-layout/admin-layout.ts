import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { Footer } from '../../shared/footer/footer';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Navbar,
    Footer
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayout {}