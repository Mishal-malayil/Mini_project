import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit
} from '@angular/core';

import {
  AnnouncementService
} from '../../../core/services/announcement';


@Component({
  selector: 'app-notifications',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './notifications.html',
  styleUrl: './notifications.css'
})
export class Notifications implements OnInit {

  announcements: any[] = [];

  loading = false;

  constructor(
    private announcementService: AnnouncementService
  ) {}


  ngOnInit(): void {

    this.loadNotifications();

  }


  loadNotifications(): void {

    this.loading = true;

    this.announcementService
      .getStudentNotifications()
      .subscribe({

        next: (response: any) => {

          console.log(
            'STUDENT NOTIFICATIONS:',
            response
          );

          this.announcements =
            response?.announcements || [];

          this.loading = false;

        },

        error: (error: any) => {

          console.error(
            'STUDENT NOTIFICATIONS ERROR:',
            error
          );

          this.announcements = [];

          this.loading = false;

        }

      });

  }


  getEventName(
    announcement: any
  ): string {

    return (
      announcement?.event?.event_name ||
      'General Notification'
    );

  }


  getEventVenue(
    announcement: any
  ): string {

    return (
      announcement?.event?.venue ||
      '-'
    );

  }


  getNotificationIcon(
    announcement: any
  ): string {

    const title =
      (
        announcement?.title ||
        ''
      ).toLowerCase();


    if (
      title.includes('result')
    ) {
      return 'bi-trophy-fill';
    }


    if (
      title.includes('registration')
    ) {
      return 'bi-person-check-fill';
    }


    if (
      title.includes('event')
    ) {
      return 'bi-calendar-event-fill';
    }


    return 'bi-bell-fill';

  }

}