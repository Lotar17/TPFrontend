import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { HomeComponent } from './home/home.component.js';
import { DashboardComponent } from './dashboard/dashboard.component.js';
import { AdminComponent } from './pages/admin/admin.component.js';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'dashboard', component: DashboardComponent },
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'admin',
    component: AdminComponent,
  },
];
