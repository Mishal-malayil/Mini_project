import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { SearchService } from '../../core/services/search';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {


  admin: any;

  constructor(private authService: AuthService, private searchService: SearchService , private router: Router) {
    this.admin = this.authService.getAdmin();
  }
searchText = '';

search() {
  console.log(this.searchText);   // <-- Add this line
  this.searchService.setSearch(this.searchText);
}
logout() {

  Swal.fire({
    title: 'Logout?',
    text: 'Are you sure you want to logout?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#2563EB',
    cancelButtonColor: '#DC2626',
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel'
  }).then((result) => {

    if (result.isConfirmed) {

      // Remove stored data
      localStorage.removeItem('token');
      localStorage.removeItem('admin');

      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        timer: 1500,
        showConfirmButton: false
      }).then(() => {

        this.router.navigate(['/login']);

      });

    }

  });

}

}