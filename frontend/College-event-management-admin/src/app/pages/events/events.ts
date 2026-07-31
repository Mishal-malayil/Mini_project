import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { EventService } from '../../core/services/event';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class Events implements OnInit {

  events: any[] = [];

  selectedEvent: any = {};

  constructor(
    private eventService: EventService
  ) {}

  ngOnInit(): void {

    this.loadEvents();

  }

  // Load All Events

  loadEvents() {

    this.eventService.getEvents().subscribe({

      next: (res: any) => {

        this.events = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // View Event

  viewEvent(id: number) {

    this.eventService.getEvent(id).subscribe({

      next: (res: any) => {

        this.selectedEvent = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // Approve Event

  approveEvent(id: number) {

    Swal.fire({

      title: 'Approve Event?',
      text: 'Are you sure you want to approve this event?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Approve',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#198754'

    }).then(result => {

      if(result.isConfirmed){

        this.eventService.approveEvent(id).subscribe({

          next: () => {

            Swal.fire({

              icon:'success',
              title:'Approved!',
              text:'Event approved successfully.',
              timer:1800,
              showConfirmButton:false

            });

            this.loadEvents();

          },

          error: () => {

            Swal.fire({

              icon:'error',
              title:'Failed',
              text:'Unable to approve event.'

            });

          }

        });

      }

    });

  }

  // Reject Event

  rejectEvent(id:number){

    Swal.fire({

      title:'Reject Event?',
      text:'Do you want to reject this event?',
      icon:'warning',
      showCancelButton:true,
      confirmButtonText:'Reject',
      cancelButtonText:'Cancel',
      confirmButtonColor:'#dc3545'

    }).then(result=>{

      if(result.isConfirmed){

        this.eventService.rejectEvent(id).subscribe({

          next:()=>{

            Swal.fire({

              icon:'success',
              title:'Rejected!',
              text:'Event rejected successfully.',
              timer:1800,
              showConfirmButton:false

            });

            this.loadEvents();

          },

          error:()=>{

            Swal.fire({

              icon:'error',
              title:'Failed',
              text:'Unable to reject event.'

            });

          }

        });

      }

    });

  }

}