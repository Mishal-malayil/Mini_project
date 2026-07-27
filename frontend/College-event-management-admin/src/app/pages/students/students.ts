import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentService } from '../../core/services/student';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule,FormsModule],
  providers: [StudentService],
  templateUrl: './students.html',
  styleUrls: ['./students.css']
})
export class Students implements OnInit {
  selectedStudent: any = {};
  editStudentData: any = {};
  isEdit = false;
  students: any[] = [];
  student = {
    name: '',
    email: '',
    phone: '',
    department: '',
    semester: '',
    password: ''
  };

  constructor(@Inject(StudentService) private studentService: StudentService) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (res) => {
        this.students = res;
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

 deleteStudent(id: number) {

  Swal.fire({
    title: 'Delete Student?',
    text: 'You will not be able to recover this record!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {

    if (result.isConfirmed) {

      this.studentService.deleteStudent(id).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Student deleted successfully.',
            confirmButtonColor: '#2563EB'
          });

          this.loadStudents(); // Reload student list

        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Failed to delete student.',
            confirmButtonColor: '#DC2626'
          });

        }

      });

    }

  });

}
   addStudent() {

    this.studentService.addStudent(this.student).subscribe({

      next: () => {

        Swal.fire({
  icon: 'success',
  title: 'Success!',
  text: 'Student added successfully.',
  confirmButtonColor: '#2563EB'
});

        this.loadStudents();

        this.student = {
          name: '',
          email: '',
          phone: '',
          department: '',
          semester: '',
          password: ''
        };

      },

      error: (err) => {

        console.log(err);

      }

    });
  }
viewStudent(id: number) {

  this.studentService.getStudent(id).subscribe({

    next: (res) => {

      this.selectedStudent = res;

    },

    error: (err) => {

      console.log(err);

    }

  });

}
editStudent(id: number) {

  this.studentService.getStudent(id).subscribe({

    next: (res) => {

      this.editStudentData = { ...res };

    }

  });

}
updateStudent() {

  const studentId = this.editStudentData?.id;

  if (!studentId) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Student ID is missing.',
      confirmButtonColor: '#DC2626'
    });
    return;
  }

  this.studentService.updateStudent(studentId, this.editStudentData).subscribe({

    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: 'Student updated successfully.',
        confirmButtonColor: '#2563EB'
      });

      this.loadStudents();

      this.isEdit = false;
      this.editStudentData = {};

      this.student = {
        name: '',
        email: '',
        phone: '',
        department: '',
        semester: '',
        password: ''
      };

    },

    error: () => {

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update student.',
        confirmButtonColor: '#DC2626'
      });

    }

  });

}
}