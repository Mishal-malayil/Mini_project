import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { CoordinatorService } from '../../core/services/coordinator';

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

  coordinator={
    name:'',
    email:'',
    phone:'',
    department:'',
    designation:'',
    password:''
  };

  selectedCoordinator:any={};

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

  addCoordinator(form:NgForm){

    if(form.invalid){

      form.control.markAllAsTouched();

      return;

    }

    this.coordinatorService.addCoordinator(this.coordinator).subscribe({

      next:()=>{

        alert("Coordinator added successfully");

        this.loadCoordinators();

        form.resetForm();

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

  editCoordinator(id:number){

    this.coordinatorService.getCoordinator(id).subscribe({

      next:(res)=>{

        this.editCoordinatorData={...res};

      }

    });

  }

  updateCoordinator(){

    this.coordinatorService.updateCoordinator(

      this.editCoordinatorData.id,

      this.editCoordinatorData

    ).subscribe({

      next:()=>{

        alert("Coordinator updated successfully");

        this.loadCoordinators();

      }

    });

  }

  deleteCoordinator(id:number){

    if(confirm("Delete this coordinator?")){

      this.coordinatorService.deleteCoordinator(id).subscribe({

        next:()=>{

          this.loadCoordinators();

        }

      });

    }

  }

}