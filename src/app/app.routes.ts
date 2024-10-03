import { Routes } from '@angular/router';
import { LoginComponent } from '../../login/login.component.js';
import { HomeBodyComponent } from '../../home-body/home-body.component.js';
import { HomeComponent } from '../../home/home.component.js';
import { DashboardComponent } from '../../dashboard/dashboard.component.js';
import { AdminComponent } from './admin.component.js';
import { AdminBodyComponent } from './admin-body/admin-body.component.js';
import { AdminPersonasComponent } from './personas/admin-personas/admin-personas.component.js';
import { RegisterComponent } from '../../register/register.component.js';
import { AdminProductosComponent } from './productos/admin-productos/admin-productos.component.js';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },

  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent },

  {
    path: '',
    component: HomeComponent,
  },

  {
    path: 'admin',
    children: [
      {
        path: '',
        component: AdminBodyComponent,
      },
      {
        path: 'personas',
        component: AdminPersonasComponent,
      },
      {
        path: 'productos',
        component: AdminProductosComponent,
      },
    ],
    component: AdminComponent,
  },
];
