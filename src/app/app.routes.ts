import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { HomeComponent } from './home/home.component.js';

export const routes: Routes = [
    {
        path:"login",component:LoginComponent,
    },
    {
        path:"", component:HomeComponent
    }
];
