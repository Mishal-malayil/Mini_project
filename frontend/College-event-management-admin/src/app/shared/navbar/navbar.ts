import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

  admin: any;

  constructor(private authService: AuthService) {
    this.admin = this.authService.getAdmin();
  }

}