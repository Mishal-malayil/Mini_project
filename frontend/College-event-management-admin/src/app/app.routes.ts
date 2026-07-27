import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Students } from './pages/students/students';
import { Coordinators } from './pages/coordinators/coordinators';
import { EventCategories } from './pages/event-categories/event-categories';
import { Events } from './pages/events/events';
import { Registrations } from './pages/registrations/registrations';
import { Attendance } from './pages/attendance/attendance';
import { Results } from './pages/results/results';
import { Announcements } from './pages/announcements/announcements';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],
    children: [

      { path: 'dashboard', component: Dashboard },
      { path: 'students', component: Students },
      { path: 'coordinators', component: Coordinators },
      { path: 'event-categories', component: EventCategories },
      { path: 'events', component: Events },
      { path: 'registrations', component: Registrations },
      { path: 'attendance', component: Attendance },
      { path: 'results', component: Results },
      { path: 'announcements', component: Announcements }

    ]
  },

  {
    path: '**',
    redirectTo: 'login'
  }

];