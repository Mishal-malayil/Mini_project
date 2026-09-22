import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { EventService } from '../../../core/services/event';
import { RegistrationService } from '../../../core/services/registration';
import { ResultService } from '../../../core/services/result';
import { AnnouncementService } from '../../../core/services/announcement';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './student-dashboard.html',
  styleUrl: './student-dashboard.css'
})
export class StudentDashboard implements OnInit {

  // =========================================================
  // STUDENT
  // =========================================================

  student: any = null;

  studentName = 'Student';
  firstName = 'Student';
  initials = '';

  currentDate = new Date();


  // =========================================================
  // DASHBOARD COUNTS
  // =========================================================

  totalEvents = 0;

  totalRegistrations = 0;

  approvedRegistrations = 0;

  pendingRegistrations = 0;

  rejectedRegistrations = 0;

  resultsCount = 0;

  approvalPercentage = 0;

  registrationPercentage = 0;


  // =========================================================
  // DATABASE DATA
  // =========================================================

  events: any[] = [];

  upcomingEvents: any[] = [];

  registrations: any[] = [];

  results: any[] = [];

  announcements: any[] = [];

  achievements: any[] = [];


  // =========================================================
  // LOADING
  // =========================================================

  loading = false;

  loadingEvents = false;

  loadingRegistrations = false;

  loadingResults = false;

  loadingAnnouncements = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private eventService: EventService,
    private registrationService: RegistrationService,
    private resultService: ResultService,
    private announcementService: AnnouncementService
  ) {}


  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {

    this.currentDate = new Date();

    this.loadStudent();

    this.loadEvents();

    this.loadRegistrations();

    this.loadResults();

    this.loadAnnouncements();

    this.loadApprovedEvents();

  }


  // =========================================================
  // LOAD STUDENT FROM LOCAL STORAGE
  // =========================================================

  loadStudent(): void {

    const studentData = localStorage.getItem('student');

    if (!studentData) {

      this.student = null;

      this.studentName = 'Student';

      this.firstName = 'Student';

      this.initials = '';

      return;
    }

    try {

      this.student = JSON.parse(studentData);

      this.studentName =
        this.student?.name?.trim() || 'Student';

      this.firstName =
        this.studentName.split(' ')[0] || 'Student';

      this.initials =
        this.getInitials(this.studentName);

    } catch (error) {

      console.error(
        'Error reading student data:',
        error
      );

      this.student = null;

      this.studentName = 'Student';

      this.firstName = 'Student';

      this.initials = '';

    }

  }


  // =========================================================
  // GET STUDENT INITIALS
  // =========================================================

  getInitials(name: string): string {

    if (!name) {
      return '';
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {

      return words[0]
        .charAt(0)
        .toUpperCase();

    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();

  }


  // =========================================================
  // LOAD EVENTS
  // =========================================================

  loadEvents(): void {

    this.loadingEvents = true;

    this.eventService.getEvents().subscribe({

      next: (response: any) => {

        const data = this.extractArray(response);

        this.events = data.map(
          (event: any) =>
            this.normalizeEvent(event)
        );

        this.totalEvents =
          this.events.length;

        this.prepareUpcomingEvents();

        this.loadingEvents = false;

      },

      error: (error) => {

        console.error(
          'Error loading events:',
          error
        );

        this.events = [];

        this.upcomingEvents = [];

        this.totalEvents = 0;

        this.loadingEvents = false;

      }

    });

  }
 // =========================================================
 //Total events count
 // =========================================================
loadApprovedEvents(): void {
  this.eventService.getStudentEvents().subscribe({
    next: (response: any) => {

      const allEvents = response.events || [];

      // Show/count only admin-approved events
      this.events = allEvents.filter(
        (event: any) => event.status === 'Approved'
      );

      this.totalEvents = this.events.length;

      console.log('Approved Events:', this.events);
      console.log('Total Approved Events:', this.totalEvents);
    },

    error: (error) => {
      console.error('Error loading events:', error);

      this.events = [];
      this.totalEvents = 0;
    }
  });
}
  // =========================================================
  // NORMALIZE EVENT DATA
  // =========================================================

  normalizeEvent(event: any): any {

    const eventDate =
      event?.event_date ??
      event?.date ??
      null;

    const categoryName =
      event?.category?.name ??
      event?.event_category?.name ??
      event?.category_name ??
      'Event';

    const venue =
      event?.venue ??
      event?.location ??
      'Venue not available';

    const time =
      event?.event_time ??
      event?.time ??
      '';

    const registered =
      this.isRegistered(
        Number(event?.id)
      );

    return {

      ...event,

      // HTML expects "date"
      date: eventDate,

      // HTML expects "time"
      time: time,

      // HTML expects "venue"
      venue: venue,

      // HTML expects "category"
      category: categoryName,

      // Category icon
      icon: this.getCategoryIcon(categoryName),

      // Student registration status
      registered: registered

    };

  }


  // =========================================================
  // PREPARE UPCOMING EVENTS
  // =========================================================

  prepareUpcomingEvents(): void {

    const today = this.getToday();

    this.upcomingEvents = this.events
      .filter((event: any) => {

        if (!event?.date) {
          return false;
        }

        return event.date >= today;

      })
      .sort((a: any, b: any) => {

        const dateA =
          new Date(a.date).getTime();

        const dateB =
          new Date(b.date).getTime();

        return dateA - dateB;

      })
      .slice(0, 6);

  }


  // =========================================================
  // LOAD STUDENT REGISTRATIONS
  // =========================================================

  loadRegistrations(): void {

    this.loadingRegistrations = true;

    this.registrationService
      .getRegistrations()
      .subscribe({

        next: (response: any) => {

          const allRegistrations =
            this.extractArray(response);

          const studentId =
            Number(this.student?.id);

          /*
           * Only registrations belonging
           * to the logged-in student.
           */

          this.registrations =
            allRegistrations.filter(
              (registration: any) =>
                Number(
                  registration?.student_id
                ) === studentId
            );


          // -----------------------------------------------
          // COUNTS
          // -----------------------------------------------

          this.totalRegistrations =
            this.registrations.length;


          this.approvedRegistrations =
            this.registrations.filter(
              (registration: any) =>
                registration?.status === 'Approved'
            ).length;


          this.pendingRegistrations =
            this.registrations.filter(
              (registration: any) =>
                registration?.status === 'Pending'
            ).length;


          this.rejectedRegistrations =
            this.registrations.filter(
              (registration: any) =>
                registration?.status === 'Rejected'
            ).length;


          // -----------------------------------------------
          // APPROVAL PERCENTAGE
          // -----------------------------------------------

          if (this.totalRegistrations > 0) {

            this.approvalPercentage =
              Math.round(
                (
                  this.approvedRegistrations /
                  this.totalRegistrations
                ) * 100
              );

          } else {

            this.approvalPercentage = 0;

          }


          // -----------------------------------------------
          // REGISTRATION PERCENTAGE
          // -----------------------------------------------

          if (this.totalEvents > 0) {

            this.registrationPercentage =
              Math.min(
                100,
                Math.round(
                  (
                    this.totalRegistrations /
                    this.totalEvents
                  ) * 100
                )
              );

          } else {

            this.registrationPercentage = 0;

          }


          // Update event registered status
          this.updateEventRegistrationStatus();

          this.loadingRegistrations = false;

        },

        error: (error) => {

          console.error(
            'Error loading registrations:',
            error
          );

          this.registrations = [];

          this.totalRegistrations = 0;

          this.approvedRegistrations = 0;

          this.pendingRegistrations = 0;

          this.rejectedRegistrations = 0;

          this.approvalPercentage = 0;

          this.registrationPercentage = 0;

          this.loadingRegistrations = false;

        }

      });

  }


  // =========================================================
  // UPDATE EVENT REGISTRATION STATUS
  // =========================================================

  updateEventRegistrationStatus(): void {

    this.events =
      this.events.map((event: any) => ({

        ...event,

        registered:
          this.isRegistered(
            Number(event?.id)
          )

      }));

    this.prepareUpcomingEvents();

  }


  // =========================================================
  // CHECK WHETHER STUDENT REGISTERED
  // =========================================================

  isRegistered(eventId: number): boolean {

    if (!eventId) {
      return false;
    }

    return this.registrations.some(
      (registration: any) =>
        Number(
          registration?.event_id
        ) === Number(eventId)
    );

  }


  // =========================================================
  // LOAD RESULTS
  // =========================================================

  loadResults(): void {

    this.loadingResults = true;

    this.resultService
      .getResults()
      .subscribe({

        next: (response: any) => {

          const allResults =
            this.extractArray(response);

          const studentId =
            Number(this.student?.id);

          this.results =
            allResults.filter(
              (result: any) =>
                Number(
                  result?.student_id
                ) === studentId
            );

          this.resultsCount =
            this.results.length;

          this.prepareAchievements();

          this.loadingResults = false;

        },

        error: (error) => {

          console.error(
            'Error loading results:',
            error
          );

          this.results = [];

          this.achievements = [];

          this.resultsCount = 0;

          this.loadingResults = false;

        }

      });

  }


  // =========================================================
  // CREATE ACHIEVEMENTS FROM REAL RESULTS
  // =========================================================

  prepareAchievements(): void {

    this.achievements =
      this.results
        .map((result: any) => {

          const position =
            result?.position ?? '';

          const eventTitle =
            result?.event?.title ??
            result?.event?.name ??
            result?.event_name ??
            'Event';


          return {

            ...result,

            position: position,

            title:
              result?.event?.title ??
              result?.event?.name ??
              result?.event_name ??
              'Event Result',

            event: eventTitle,

            icon:
              this.getResultIcon(position)

          };

        })
        .slice(0, 5);

  }


  // =========================================================
  // RESULT ICON
  // =========================================================

  getResultIcon(position: string): string {

    switch (position) {

      case 'First':
        return 'bi-trophy-fill';

      case 'Second':
        return 'bi-award-fill';

      case 'Third':
        return 'bi-medal-fill';

      case 'Participation':
        return 'bi-star-fill';

      default:
        return 'bi-trophy';

    }

  }


  // =========================================================
  // LOAD ANNOUNCEMENTS
  // =========================================================

  loadAnnouncements(): void {

    this.loadingAnnouncements = true;

    this.announcementService
      .getAnnouncements()
      .subscribe({

        next: (response: any) => {

          const data =
            this.extractArray(response);

          this.announcements =
            data
              .map((announcement: any) => ({

                ...announcement,

                date:
                  announcement?.created_at ??
                  announcement?.date ??
                  null,

                message:
                  announcement?.message ??
                  announcement?.description ??
                  announcement?.content ??
                  '',

                icon:
                  announcement?.icon ??
                  'bi-megaphone'

              }))
              .sort(
                (a: any, b: any) => {

                  const dateA =
                    a?.date
                      ? new Date(a.date).getTime()
                      : 0;

                  const dateB =
                    b?.date
                      ? new Date(b.date).getTime()
                      : 0;

                  return dateB - dateA;

                }
              )
              .slice(0, 5);

          this.loadingAnnouncements = false;

        },

        error: (error) => {

          console.error(
            'Error loading announcements:',
            error
          );

          this.announcements = [];

          this.loadingAnnouncements = false;

        }

      });

  }


  // =========================================================
  // CATEGORY CLASS
  // =========================================================

  getCategoryClass(category: string): string {

    if (!category) {
      return 'default';
    }

    const value =
      category
        .toLowerCase()
        .trim();


    if (
      value.includes('sport') ||
      value.includes('football') ||
      value.includes('cricket') ||
      value.includes('athletic')
    ) {

      return 'sports';

    }


    if (
      value.includes('cultur') ||
      value.includes('music') ||
      value.includes('dance') ||
      value.includes('art')
    ) {

      return 'cultural';

    }


    if (
      value.includes('technical') ||
      value.includes('tech') ||
      value.includes('coding') ||
      value.includes('program')
    ) {

      return 'technical';

    }


    if (
      value.includes('academic') ||
      value.includes('seminar') ||
      value.includes('workshop')
    ) {

      return 'academic';

    }


    return 'default';

  }


  // =========================================================
  // CATEGORY ICON
  // =========================================================

  getCategoryIcon(category: string): string {

    if (!category) {
      return 'bi-calendar-event';
    }

    const value =
      category
        .toLowerCase()
        .trim();


    if (
      value.includes('sport') ||
      value.includes('football') ||
      value.includes('cricket') ||
      value.includes('athletic')
    ) {

      return 'bi-trophy';

    }


    if (
      value.includes('music') ||
      value.includes('dance') ||
      value.includes('cultur') ||
      value.includes('art')
    ) {

      return 'bi-music-note-beamed';

    }


    if (
      value.includes('technical') ||
      value.includes('tech') ||
      value.includes('coding') ||
      value.includes('program')
    ) {

      return 'bi-code-slash';

    }


    if (
      value.includes('academic') ||
      value.includes('seminar') ||
      value.includes('workshop')
    ) {

      return 'bi-mortarboard';

    }


    return 'bi-calendar-event';

  }


  // =========================================================
  // REGISTER EVENT
  // =========================================================

  registerEvent(event: any): void {

    /*
     * Registration API should be handled by the
     * RegistrationService.
     *
     * This method currently prevents duplicate
     * registration and keeps the dashboard state
     * consistent.
     *
     * Add the student registration POST method
     * to RegistrationService if it does not already exist.
     */

    if (!event?.id) {
      return;
    }

    if (this.isRegistered(Number(event.id))) {

      return;

    }

    console.warn(
      'Student registration API method is not configured yet.'
    );

  }


  // =========================================================
  // GET TODAY
  // =========================================================

  getToday(): string {

    const today = new Date();

    const year =
      today.getFullYear();

    const month =
      String(
        today.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        today.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // =========================================================
  // FORMAT EVENT DATE
  // =========================================================

  formatEventDate(
    date: string | null | undefined
  ): string {

    if (!date) {
      return 'Date not available';
    }

    const eventDate =
      new Date(date);

    if (isNaN(eventDate.getTime())) {
      return date;
    }

    return eventDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =========================================================
  // FORMAT ANNOUNCEMENT DATE
  // =========================================================

  formatAnnouncementDate(
    date: string | null | undefined
  ): string {

    if (!date) {
      return '';
    }

    const announcementDate =
      new Date(date);

    if (isNaN(announcementDate.getTime())) {
      return date;
    }

    return announcementDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // =========================================================
  // EVENT STATUS
  // =========================================================

  getEventStatus(event: any): string {

    if (!event?.date) {
      return 'Unknown';
    }

    const today =
      this.getToday();

    if (event.date === today) {
      return 'Today';
    }

    if (event.date > today) {
      return 'Upcoming';
    }

    return 'Completed';

  }


  // =========================================================
  // REGISTRATION STATUS
  // =========================================================

  getRegistrationStatus(
    eventId: number
  ): string | null {

    const registration =
      this.registrations.find(
        (item: any) =>
          Number(item?.event_id) ===
          Number(eventId)
      );

    return registration?.status ?? null;

  }


  // =========================================================
  // RESULT POSITION
  // =========================================================

  getResultPosition(eventId: number): string {

    const result =
      this.results.find(
        (item: any) =>
          Number(item?.event_id) ===
          Number(eventId)
      );

    return result?.position ?? '';

  }


  // =========================================================
  // RESULT BADGE CLASS
  // =========================================================

  getResultBadgeClass(
    position: string
  ): string {

    switch (position) {

      case 'First':
        return 'first';

      case 'Second':
        return 'second';

      case 'Third':
        return 'third';

      case 'Participation':
        return 'participation';

      default:
        return '';

    }

  }


  // =========================================================
  // EVENT CATEGORY NAME
  // =========================================================

  getEventCategory(event: any): string {

    return (
      event?.category?.name ??
      event?.event_category?.name ??
      event?.category_name ??
      'Event'
    );

  }


  // =========================================================
  // COORDINATOR NAME
  // =========================================================

  getCoordinatorName(event: any): string {

    return (
      event?.coordinator?.name ??
      event?.coordinator_name ??
      'Coordinator'
    );

  }


  // =========================================================
  // STUDENT FIRST NAME
  // =========================================================

  getStudentFirstName(): string {

    return this.firstName;

  }


  // =========================================================
  // EXTRACT ARRAY FROM API RESPONSE
  // =========================================================

  private extractArray(response: any): any[] {

    if (Array.isArray(response)) {
      return response;
    }

    if (Array.isArray(response?.data)) {
      return response.data;
    }

    if (Array.isArray(response?.results)) {
      return response.results;
    }

    return [];

  }


  // =========================================================
  // REFRESH DASHBOARD
  // =========================================================

  refreshDashboard(): void {

    this.loadStudent();

    this.loadEvents();

    this.loadRegistrations();

    this.loadResults();

    this.loadAnnouncements();

  }

}