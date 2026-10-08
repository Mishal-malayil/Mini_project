import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';
import { EventService } from '../../../core/services/event';

@Component({
  selector: 'app-explore-events',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './explore-events.html',
  styleUrl: './explore-events.css'
})
export class ExploreEvents implements OnInit {

  events: any[] = [];
  filteredEvents: any[] = [];

  categories: any[] = [];

  searchText = '';
  selectedCategory = 'all';

  loading = false;

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.loadCategories();
  }

  loadEvents(): void {
    this.loading = true;

    this.eventService.getStudentEvents().subscribe({
      next: (response: any) => {

        this.events = response.events || response.data || response || [];

        this.filteredEvents = [...this.events];

        this.loading = false;
      },

      error: (error: any) => {

        console.error('Events loading error:', error);

        this.loading = false;

        Swal.fire({
          icon: 'error',
          title: 'Unable to Load Events',
          text: error?.error?.message ||
                'Something went wrong while loading events.'
        });
      }
    });
  }

  loadCategories(): void {

    this.eventService.getCategories().subscribe({
      next: (response: any) => {

        this.categories =
          response.categories ||
          response.data ||
          response ||
          [];
      },

      error: (error: any) => {
        console.error('Categories loading error:', error);
      }
    });
  }

  filterEvents(): void {

    const search = this.searchText
      .toLowerCase()
      .trim();

    this.filteredEvents = this.events.filter((event: any) => {

      const matchesSearch =
        !search ||
        event.title?.toLowerCase().includes(search) ||
        event.description?.toLowerCase().includes(search) ||
        event.venue?.toLowerCase().includes(search);

      const categoryId =
        event.category_id ??
        event.event_category_id ??
        event.category?.id;

      const matchesCategory =
        this.selectedCategory === 'all' ||
        String(categoryId) === String(this.selectedCategory);

      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(categoryId: any): void {

    this.selectedCategory = String(categoryId);

    this.filterEvents();
  }

  clearFilters(): void {

    this.searchText = '';
    this.selectedCategory = 'all';

    this.filteredEvents = [...this.events];
  }

  viewEvent(id: number): void {

    this.router.navigate([
      '/student/events',
      id
    ]);
  }

 registerEvent(eventId: number): void {

  this.eventService.registerStudentEvent(eventId).subscribe({

    next: (response: any) => {

      console.log('REGISTRATION RESPONSE:', response);

      const event = this.filteredEvents.find(
        e => e.id === eventId
      );

      if (event) {
        event.is_registered = true;
        event.registration_status = 'Pending';
      }

      // If you have SweetAlert:
      Swal.fire({
        icon: 'success',
        title: 'Registration Submitted',
        text: 'Your registration is pending coordinator approval.',
        confirmButtonText: 'OK'
      });

    },

    error: (error: any) => {

      console.error('REGISTRATION ERROR:', error);

      Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: error?.error?.message || 'Unable to register for this event.'
      });

    }

  });
}

 getEventImage(event: any): string {
  if (event.image) {
    return event.image;
  }

  return 'assets/images/event-placeholder.jpg';
}

  getCategoryName(event: any): string {

    return event.category?.name ||
           event.category_name ||
           'General';
  }

  formatDate(date: string): string {

    if (!date) {
      return 'Date not available';
    }

    return new Date(date).toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }

  formatTime(time: string): string {

    if (!time) {
      return 'Time not available';
    }

    const date = new Date(`1970-01-01T${time}`);

    return date.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }
}