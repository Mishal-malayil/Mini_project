import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth';
import { SearchService } from '../../core/services/search';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { ProfileService } from '../../core/services/profile';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [FormsModule,CommonModule ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
changePasswordData = {
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
};

showCurrentPassword = false;
showNewPassword = false;
showConfirmPassword = false;
adminProfile: any = {};

editProfileData: any = {};
  admin: any;

  constructor(private authService: AuthService, private searchService: SearchService , private router: Router, private profileService: ProfileService) {
    this.admin = this.authService.getAdmin();
  }
searchText = '';
ngOnInit(): void {
  this.admin = this.authService.getAdmin();
}
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

viewProfile() {

  this.profileService.getProfile().subscribe({

    next: (res) => {

      this.adminProfile = res;
      this.editProfileData = { ...res };

    },

    error: () => {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Unable to load profile.',
        confirmButtonColor: '#2563EB'
      });

    }

  });

}
updateProfile() {

  this.profileService.updateProfile(this.editProfileData).subscribe({

    next: (res: any) => {

      this.adminProfile = res.admin;
      this.admin = res.admin;

      // Update localStorage
      this.authService.saveAdmin(res.admin);

      // Close Bootstrap modal
      const modal = document.getElementById('profileModal');
      const bsModal = (window as any).bootstrap.Modal.getInstance(modal);
      bsModal?.hide();

      Swal.fire({
        icon: 'success',
        title: 'Profile Updated!',
        text: res.message,
        confirmButtonColor: '#2563EB'
      });

    },

    error: () => {

      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: 'Unable to update profile.',
        confirmButtonColor: '#DC2626'
      });

    }

  });

}



openChangePassword() {

  this.changePasswordData = {
    current_password: '',
    new_password: '',
    new_password_confirmation: ''
  };

  this.showCurrentPassword = false;
  this.showNewPassword = false;
  this.showConfirmPassword = false;

}


changePassword() {

  // Check empty fields
  if (
    !this.changePasswordData.current_password ||
    !this.changePasswordData.new_password ||
    !this.changePasswordData.new_password_confirmation
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Missing Fields',
      text: 'Please fill all password fields.',
      confirmButtonColor: '#2563EB'
    });

    return;
  }

  // Check minimum password length
  if (this.changePasswordData.new_password.length < 6) {

    Swal.fire({
      icon: 'warning',
      title: 'Invalid Password',
      text: 'New password must contain at least 6 characters.',
      confirmButtonColor: '#F59E0B'
    });

    return;
  }

  // Check password confirmation
  if (
    this.changePasswordData.new_password !==
    this.changePasswordData.new_password_confirmation
  ) {

    Swal.fire({
      icon: 'warning',
      title: 'Password Mismatch',
      text: 'New password and confirm password do not match.',
      confirmButtonColor: '#F59E0B'
    });

    return;
  }

  // Call Laravel API
  this.profileService
    .changePassword(this.changePasswordData)
    .subscribe({

      next: (res: any) => {

        // Reset fields
        this.changePasswordData = {
          current_password: '',
          new_password: '',
          new_password_confirmation: ''
        };

        this.showCurrentPassword = false;
        this.showNewPassword = false;
        this.showConfirmPassword = false;

        // Close modal
        const modalElement =
          document.getElementById('changePasswordModal');

        if (modalElement) {

          const closeButton =
            modalElement.querySelector(
              '[data-bs-dismiss="modal"]'
            ) as HTMLElement;

          closeButton?.click();

        }

        // Success message
        Swal.fire({
          icon: 'success',
          title: 'Password Changed!',
          text: res.message || 'Your password has been changed successfully.',
          confirmButtonColor: '#2563EB'
        });

      },

      error: (error) => {

        console.log('Change Password Error:', error);

        if (error.status === 422) {

          Swal.fire({
            icon: 'warning',
            title: 'Password Error',
            text: error.error?.message ||
                  'Current password is incorrect or the passwords are invalid.',
            confirmButtonColor: '#F59E0B'
          });

        } else {

          Swal.fire({
            icon: 'error',
            title: 'Update Failed',
            text: 'Unable to change password. Please try again.',
            confirmButtonColor: '#DC2626'
          });

        }

      }

    });

}
}