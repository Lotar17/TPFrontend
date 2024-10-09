import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { HomeComponent } from './home/home.component.js';
import { DashboardComponent } from './dashboard/dashboard.component.js';
import { ProductosComponent } from './producto/producto.component.js';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component.js';
import { ListaComponent } from './lista/lista.component.js';
import { AdminBodyComponent } from './pages/admin/admin-body/admin-body.component.js';
import { AdminPersonasComponent } from './pages/admin/personas/admin-personas/admin-personas.component.js';
import { AdminComponent } from './pages/admin/admin.component.js';
import { RegisterComponent } from './register/register.component.js';
import { CargoProductosComponent } from './cargo-productos/cargo-productos.component.js';
import { ComprarComponent } from '../comprar/comprar.component.js';


export const routes: Routes = [
    {
        path:"login",component:LoginComponent
    },
    {path: 'register',component:RegisterComponent},

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
        path:"publicaprod",component:CargoProductosComponent
    },


{
    path:"productos/:id",component:ProductoDetalleComponent
        
},

{
    path:"productos/:id/comprar", component:ComprarComponent
        
},

{
    path:"lista",
    component:ListaComponent
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
    ],
    component: AdminComponent,
},


];
