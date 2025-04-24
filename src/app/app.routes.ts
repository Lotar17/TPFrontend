import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component.js';
import { HomeBodyComponent } from './home-body/home-body.component.js';
import { HomeComponent } from './home/home.component.js';
import { ProductosComponent } from './producto/producto.component.js';
import { ProductoDetalleComponent } from './producto-detalle/producto-detalle.component.js';
import { SidebarComponent } from './sidebar/sidebar.component.js';
import { AdminBodyComponent } from './pages/admin/admin-body/admin-body.component.js';
import { AdminPersonasComponent } from './pages/admin/personas/admin-personas/admin-personas.component.js';
import { AdminComponent } from './pages/admin/admin.component.js';
import { AdminProductosComponent } from './pages/admin/productos/admin-productos/admin-productos.component.js';
import { RegisterComponent } from './register/register.component.js';
import { CargoProductosComponent } from './cargo-productos/cargo-productos.component.js';
import { AdminCategoriasComponent } from './pages/admin/categorias/admin-categorias/admin-categorias.component.js';
import { AdminFormasDePagoComponent } from './pages/admin/formas-de-pago/admin-formas-de-pago/admin-formas-de-pago.component.js';
import { MisComprasComponent } from './miscompras/miscompras.component.js';
import { checkRolGuard } from './guards/check-rol.guard.js';
import { DirectBuysComponent } from './direct-buys/direct-buys.component.js';
import { CartComponent } from './cart/cart.component.js';
import { BuysComponent } from './buys/buys.component.js';
import { DevolucionComponent } from './devolucion/devolucion.component.js';
import { PanelVendedorComponent } from './panel-vendedor/panel-vendedor.component.js';
import { SolicitudDevolucionComponent } from './solicitud-devolucion/solicitud-devolucion.component.js';
import { DevolucionVendedorComponent } from './devolucion-vendedor/devolucion-vendedor.component.js';
import { DevolucionCompradorComponent } from './devolucion-comprador/devolucion-comprador.component.js';
import { ModificaProductoComponent } from './vendedor-pages/modifica-producto/modifica-producto.component.js';
import { PanelSeguimientoClienteComponent } from './seguimiento/panel-seguimiento-cliente/panel-seguimiento-cliente.component.js';
import { PanelEmpleadoSegumientoComponent } from './seguimiento/panel-empleado-segumiento/panel-empleado-segumiento.component.js';
import { LocalidadesComponent } from './pages/admin/localidades/localidades.component.js';
import { MiCuentaComponent } from './mi-cuenta/mi-cuenta.component.js';
import { MisventasComponent } from './misventas/misventas.component.js';
import { OlvidaPasswordComponent } from './olvida-password/olvida-password.component.js';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'register', component: RegisterComponent },

  {
    path: '',
    component: HomeComponent,
  },
  
  {
    path: 'olvidapassword',
    component: OlvidaPasswordComponent,
  },
  
  {
    path: 'productos',
    component: ProductosComponent,
  },
  {
    path: 'publicaprod',
    component: CargoProductosComponent,
  },
  {
    path: 'devolucion/:id',
    component: DevolucionComponent,
  },

  {
    path: 'productos',
    component: ProductosComponent,
  },

  {
    path: 'comprasincart/:id',
    component: DirectBuysComponent,
  },
  {
    path: 'solicitud',
    component: SolicitudDevolucionComponent,
  },

  {
    path: 'publicaprod',
    component: CargoProductosComponent,
  },
  {
    path: 'compras',
    component: MisComprasComponent,
  },

  {
    path: 'productos/:id',
    component: ProductoDetalleComponent,
  },

  {
    path: 'carrito/:id',
    component: CartComponent,
  },
  {
    path: 'buys',
    component: BuysComponent,
  },

  {
    path: 'vendedor',
    component: PanelVendedorComponent,
  },
  {
    path: 'devolucionVendedor',
    component: DevolucionVendedorComponent,
  },
  {
    path: 'devolucionComprador',
    component: DevolucionCompradorComponent,
  },
  {
    path: 'modificaProducto',
    component: ModificaProductoComponent,
  },
  {
    path: 'panelSeguimientoCliente',
    component: PanelSeguimientoClienteComponent,
  },
  {
    path: 'panelSeguimientoEmpleado',
    component: PanelEmpleadoSegumientoComponent,
  },
  {
    path: 'sideBar',
    component: SidebarComponent,
  },
  {
    path: 'micuenta',
    component: MiCuentaComponent,
  },
  {
    path: 'misventas',
    component: MisventasComponent,
  },
  {
    path: 'admin',
    canActivateChild: [checkRolGuard],
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
      { path: 'categorias', component: AdminCategoriasComponent },
      { path: 'formas-de-pago', component: AdminFormasDePagoComponent },
      { path: 'localidades', component: LocalidadesComponent },
    ],
    component: AdminComponent,
  },
];
