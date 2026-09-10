import { Component } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

import { StudentAuthService } from '../../../core/services/student-auth';

@Component({
  selector: 'app-student-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './student-register.html',
  styleUrl: './student-register.css'
})
export class StudentRegister {

  // Declare the form only
  registerForm: any;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: StudentAuthService,
    private router: Router
  ) {

    // Create the form inside constructor
    this.registerForm = this.fb.nonNullable.group({

  name: [
    '',
    [
      Validators.required,
      Validators.minLength(3)
    ]
  ],

  // EMAIL
  email: [
    '',
    [
      Validators.required,
      Validators.email
    ]
  ],

  // MOBILE NUMBER
  phone: [
    '',
    [
      Validators.required,
      Validators.pattern(/^[6-9][0-9]{9}$/)
    ]
  ],

  department: [
    '',
    [
      Validators.required
    ]
  ],

  semester: [
    1,
    [
      Validators.required,
      Validators.min(1),
      Validators.max(8)
    ]
  ],

  // PASSWORD
  password: [
    '',
    [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
      )
    ]
  ],

  password_confirmation: [
    '',
    [
      Validators.required
    ]
  ]

});
  }

  register() {

    // Check validation
    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }

    // Get form data
    const formData = this.registerForm.getRawValue();

    // Check password match
    if (
      formData.password !==
      formData.password_confirmation
    ) {

      Swal.fire({
        icon: 'warning',
        title: 'Password Mismatch',
        text: 'Passwords do not match.'
      });

      return;
    }

    this.loading = true;

    // Call API
    this.authService.register(formData)
      .subscribe({

        // SUCCESS
        next: (response: any) => {

          console.log(
            'Registration Response:',
            response
          );

          this.loading = false;

          // Store token
          localStorage.setItem(
            'student_token',
            response.token
          );

          // Store student
          localStorage.setItem(
            'student',
            JSON.stringify(response.student)
          );

          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your student account has been created.',
            timer: 1800,
            showConfirmButton: false
          });

          // Go to dashboard
          this.router.navigate([
            '/student/dashboard'
          ]);
        },

        // ERROR
        error: (error) => {

          console.error(
            'Registration Error:',
            error
          );

          this.loading = false;

          let message = 'Registration failed.';

          // Laravel validation errors
          if (error.error?.errors) {

            const errors = error.error.errors;

            message = Object.values(errors)
              .flat()
              .join('<br>');

          }

          // Backend message
          else if (error.error?.message) {

            message = error.error.message;
          }

          Swal.fire({
            icon: 'error',
            title: 'Registration Failed',
            html: message
          });
        }

      });
  }
}