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

import { CoordinatorLogin } from './coordinator/login/coordinator-login/coordinator-login';

import { CoordinatorDashboard } from './coordinator/dashboard/coordinator-dashboard/coordinator-dashboard';

import { CoordinatorLayout } from './coordinator/layout/coordinator-layout/coordinator-layout';

export const routes: Routes = [

  // =========================
  // DEFAULT
  // =========================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // =========================
  // ADMIN LOGIN
  // =========================

  {
    path: 'login',
    component: Login
  },

  // =========================
  // COORDINATOR LOGIN
  // =========================

  {
  path: 'coordinator/login',
  component: CoordinatorLogin
},

{
  path: 'coordinator',
  component: CoordinatorLayout,
  children: [

    {
      path: 'dashboard',
      component: CoordinatorDashboard
    }

  ]
},

  // =========================
  // ADMIN PANEL
  // =========================

  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard],

    children: [

      {
        path: 'dashboard',
        component: Dashboard
      },

      {
        path: 'students',
        component: Students
      },

      {
        path: 'coordinators',
        component: Coordinators
      },

      {
        path: 'event-categories',
        component: EventCategories
      },

      {
        path: 'events',
        component: Events
      },

      {
        path: 'registrations',
        component: Registrations
      },

      {
        path: 'attendance',
        component: Attendance
      },

      {
        path: 'results',
        component: Results
      },

      {
        path: 'announcements',
        component: Announcements
      }

    ]
  },
 

  // =========================
  // INVALID URL
  // =========================

  {
    path: '**',
    redirectTo: 'login'
  }

];