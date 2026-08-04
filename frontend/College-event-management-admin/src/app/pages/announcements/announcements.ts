import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { AnnouncementService } from '../../core/services/announcement';
import { EventService } from '../../core/services/event';

declare var bootstrap: any;

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css'
})
export class Announcements implements OnInit {

  announcements: any[] = [];
  events: any[] = [];

  announcement: any = {
    title: '',
    message: '',
    event_id: '',
    published_at: ''
  };

  selectedAnnouncement: any = {};

  constructor(
    private announcementService: AnnouncementService,
    private eventService: EventService
  ) { }

  ngOnInit(): void {

    this.getAnnouncements();
    this.getEvents();

  }

  // Load Announcements
  getAnnouncements() {

    this.announcementService.getAnnouncements().subscribe({

      next: (res: any) => {

        this.announcements = res;

      },

      error: (err) => {

        console.log(err);

      }

    });

  }

  // Load Events
  getEvents() {

    this.eventService.getEvents().subscribe({

      next: (res: any) => {

        this.events = res;

      }

    });

  }

  // Add Announcement
  addAnnouncement() {

    this.announcementService.addAnnouncement(this.announcement).subscribe({

      next: (res: any) => {

        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: res.message,
          timer: 1800,
          showConfirmButton: false
        });

        this.getAnnouncements();

        this.announcement = {
          title: '',
          message: '',
          event_id: '',
          published_at: ''
        };

        bootstrap.Modal.getInstance(
          document.getElementById('addAnnouncementModal')
        )?.hide();

      },

      error: (err) => {

        Swal.fire(
          'Error',
          err.error.message || 'Unable to add announcement',
          'error'
        );

      }

    });

  }

  // View Announcement
  viewAnnouncement(id: number) {

    this.announcementService.getAnnouncement(id).subscribe({

      next: (res: any) => {

        this.selectedAnnouncement = res;

      }

    });

  }

  // Edit Announcement
  editAnnouncement(id: number) {

    this.announcementService.getAnnouncement(id).subscribe({

      next: (res: any) => {

        this.selectedAnnouncement = { ...res };

      }

    });

  }

  // Update Announcement
  updateAnnouncement() {

    this.announcementService.updateAnnouncement(
      this.selectedAnnouncement.id,
      this.selectedAnnouncement
    ).subscribe({

      next: (res: any) => {

        Swal.fire({
          icon: 'success',
          title: 'Updated',
          text: res.message,
          timer: 1800,
          showConfirmButton: false
        });

        this.getAnnouncements();

        bootstrap.Modal.getInstance(
          document.getElementById('editAnnouncementModal')
        )?.hide();

      },

      error: (err) => {

        Swal.fire(
          'Error',
          err.error.message || 'Unable to update announcement',
          'error'
        );

      }

    });

  }

  // Delete Announcement
  deleteAnnouncement(id: number) {

    Swal.fire({

      title: 'Delete Announcement?',
      text: 'This announcement will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Delete'

    }).then((result) => {

      if (result.isConfirmed) {

        this.announcementService.deleteAnnouncement(id).subscribe({

          next: (res: any) => {

            Swal.fire({
              icon: 'success',
              title: 'Deleted',
              text: res.message,
              timer: 1800,
              showConfirmButton: false
            });

            this.getAnnouncements();

          },

          error: () => {

            Swal.fire(
              'Error',
              'Unable to delete announcement',
              'error'
            );

          }

        });

      }

    });

  }

}