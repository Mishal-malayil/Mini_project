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


// ================= COORDINATOR =================

import { CoordinatorLogin } from './coordinator/login/coordinator-login/coordinator-login';

import { CoordinatorLayout } from './coordinator/layouts/coordinator-layout/coordinator-layout';

import { CoordinatorDashboard } from './coordinator/pages/coordinator-dashboard/coordinator-dashboard';

import { CoordinatorEvents } from './coordinator/pages/coordinator-event/coordinator-event';

import { EventSchedule } from './coordinator/pages/event-schedule/event-schedule';

import { CoordinatorRegistrations } from './coordinator/pages/registrations/registrations';

import { CoordinatorAttendance } from './coordinator/pages/attendance/attendance';

import { CoordinatorResult } from './coordinator/pages/result/result';

import { Notification } from './coordinator/pages/notification/notification';

import { Profile } from './coordinator/pages/profile/profile';

export const routes: Routes = [

    // ============================================
    // DEFAULT
    // ============================================

    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },


    // ============================================
    // ADMIN LOGIN
    // ============================================

    {
        path: 'login',
        component: Login
    },


    // ============================================
    // COORDINATOR LOGIN
    // ============================================

    {
        path: 'coordinator/login',
        component: CoordinatorLogin
    },


    // ============================================
    // ADMIN PANEL
    // ============================================

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


    // ============================================
    // COORDINATOR PANEL
    // ============================================

    {
        path: 'coordinator',
        component: CoordinatorLayout,

        children: [

            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },

            {
                path: 'dashboard',
                component: CoordinatorDashboard
            },

            {
                path: 'events',
                component: CoordinatorEvents
            },
            {
                path: 'schedule',
                component: EventSchedule
            },
            {
                path: 'registrations',
                component: CoordinatorRegistrations
            },
            {
                path: 'attendance',
                component: CoordinatorAttendance
            },
            {
  path: 'results',
  component: CoordinatorResult
},
{
    path: 'notifications',
    component: Notification
},
{
    path: 'profile',
    component: Profile 
}


        ]
    },


    // ============================================
    // INVALID URL
    // ============================================

    {
        path: '**',
        redirectTo: 'login'
    }

];