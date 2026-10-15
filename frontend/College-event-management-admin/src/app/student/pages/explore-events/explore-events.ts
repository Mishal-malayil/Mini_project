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
  const event = this.events.find((item: any) => item.id === eventId);

  Swal.fire({
    title: 'Confirm Registration',
    text: `Are you sure you want to register for "${event?.event_name || 'this event'}"?`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes, Register',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#2563eb',
    cancelButtonColor: '#6b7280',
    reverseButtons: true
  }).then((result) => {
    if (!result.isConfirmed) {
      return;
    }

    this.eventService.registerStudentEvent(eventId).subscribe({
      next: (response: any) => {
        const selectedEvent = this.events.find(
          (item: any) => item.id === eventId
        );

        if (selectedEvent) {
          selectedEvent.is_registered = true;
          selectedEvent.registration_status = 'Pending';
        }

        this.filterEvents();

        Swal.fire({
          title: 'Registration Submitted!',
          text: response?.message ||
            'Your registration request has been submitted successfully.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#2563eb'
        });
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Registration Failed',
          text: error?.error?.message ||
            'Unable to register for this event. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
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

 formatDate(date: string | null | undefined): string {
  if (!date) {
    return 'Date not specified';
  }

  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

  formatTime(time: string | null | undefined): string {
  if (!time) {
    return 'Not specified';
  }

  const [hours, minutes] = time.split(':');

  const date = new Date();
  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}
}