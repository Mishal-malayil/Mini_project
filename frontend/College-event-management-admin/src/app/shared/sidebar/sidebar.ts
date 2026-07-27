import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {

  admin: any;

  constructor(private authService: AuthService) {
    this.admin = this.authService.getAdmin();
  }

}