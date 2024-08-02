import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import path from 'node:path';
import { LoginComponent } from './login/login.component.js';

export const routes: Routes = [
    {path:'login', component :LoginComponent}
];
