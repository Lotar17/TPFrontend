import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { HomeComponent } from './home/home.component.js';
import { DashboardComponent } from './dashboard/dashboard.component.js';
import { ProductosComponent } from './producto/producto.component.js';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component.js';


export const routes: Routes = [
    {
        path:"login",component:LoginComponent
    },
    {path:'dashboard',
        component:DashboardComponent
    },
    {
        path:"", component:HomeComponent,
    },
    {
        path:"productos", component:ProductosComponent,
    },
    

 {
    path:"productos/:id",
    component:ProductoDetalleComponent
}

];
