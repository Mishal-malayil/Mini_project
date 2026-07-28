import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CoordinatorService } from '../../core/services/coordinator';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-coordinators',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './coordinators.html',
  styleUrl: './coordinators.css'
})
export class Coordinators implements OnInit {

  coordinators:any[]=[];

  coordinator:any = {
    id: undefined,
    name:'',
    email:'',
    phone:'',
    department:'',
    designation:'',
    password:''
  };

  selectedCoordinator:any={};

  isEdit:boolean = false;

  editCoordinatorData:any={};

  constructor(private coordinatorService:CoordinatorService){}

  ngOnInit(): void {

    this.loadCoordinators();

  }

  loadCoordinators(){

    this.coordinatorService.getCoordinators().subscribe({

      next:(res)=>{

        this.coordinators=res;

      }

    });

  }

  addCoordinator() {

  this.coordinatorService.addCoordinator(this.coordinator).subscribe({

    next: () => {

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Coordinator added successfully.',
        confirmButtonColor: '#2563EB'
      });

      this.loadCoordinators();

      this.coordinator = {
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        password: ''
      };

    },

    error: (error) => {

      if (error.status === 422) {

        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          text: 'Please fill all required fields correctly.',
          confirmButtonColor: '#F59E0B'
        });

      }
      else if (error.status === 409) {

        Swal.fire({
          icon: 'error',
          title: 'Duplicate Email',
          text: 'This email already exists.',
          confirmButtonColor: '#DC2626'
        });

      }
      else {

        Swal.fire({
          icon: 'error',
          title: 'Oops!',
          text: 'Something went wrong. Please try again.',
          confirmButtonColor: '#DC2626'
        });

      }

    }

  });

}

  viewCoordinator(id:number){

    this.coordinatorService.getCoordinator(id).subscribe({

      next:(res)=>{

        this.selectedCoordinator=res;

      }

    });

  }

editCoordinator(coordinator: any) {

  this.editCoordinatorData = { ...coordinator };

}

  updateCoordinator() {

  this.coordinatorService.updateCoordinator(
    this.coordinator.id,
    this.coordinator
  ).subscribe({

    next: (response) => {

      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: response.message || 'Coordinator updated successfully.',
        confirmButtonColor: '#2563EB'
      });

      this.loadCoordinators();

      this.isEdit = false;

      this.coordinator = {
        id: null,
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        password: ''
      };

    },

    error: (error) => {

      Swal.fire({
        icon: 'error',
        title: 'Update Failed!',
        text: error.error?.message || 'Unable to update coordinator.',
        confirmButtonColor: '#DC2626'
      });

    }

  });

}

  deleteCoordinator(id: number) {

  Swal.fire({
    title: 'Delete Coordinator?',
    text: 'You will not be able to recover this record!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DC2626',
    cancelButtonColor: '#6B7280',
    confirmButtonText: 'Yes, Delete',
    cancelButtonText: 'Cancel'
  }).then((result) => {

    if (result.isConfirmed) {

      this.coordinatorService.deleteCoordinator(id).subscribe({

        next: () => {

          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Coordinator deleted successfully.',
            confirmButtonColor: '#2563EB'
          });

          this.loadCoordinators();

        },

        error: () => {

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Unable to delete coordinator.',
            confirmButtonColor: '#DC2626'
          });

        }

      });

    }

  });

}
}