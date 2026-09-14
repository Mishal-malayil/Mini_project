
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

  registerForm: any;

  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: StudentAuthService,
    private router: Router
  ) {

    this.registerForm = this.fb.nonNullable.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

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

  register(): void {

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

    // Call registration API
    this.authService.register(formData)
      .subscribe({

        // SUCCESS
        next: (response: any) => {

          console.log(
            'Registration Response:',
            response
          );

          this.loading = false;

          /*
           * IMPORTANT:
           * Do NOT store student_token here.
           * Registration should NOT automatically log in the student.
           *
           * Do NOT store student data here.
           * Student data should be stored only after LOGIN.
           */

          Swal.fire({
            icon: 'success',
            title: 'Registration Successful',
            text: 'Your account has been created. Please login to continue.',
            confirmButtonText: 'Go to Login',
            allowOutsideClick: false
          }).then(() => {

            // Go to Student Login
            this.router.navigate([
              '/student/login'
            ]);

          });

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

