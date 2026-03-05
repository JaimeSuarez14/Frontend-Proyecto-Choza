import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Públicas
  {
    path: '',
    loadComponent: () =>
      import('./modules/public/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'menu',
    loadComponent: () =>
      import('./modules/public/menu/menu.component').then((m) => m.MenuComponent),
  },
  {
    path: 'nosotros',
    loadComponent: () =>
      import('./modules/public/nosotros/nosotros.component').then((m) => m.NosotrosComponent),
  },

  // Auth
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./modules/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/registro',
    loadComponent: () =>
      import('./modules/auth/registro/registro.component').then((m) => m.RegistroComponent),
  },

  // Carrito (público)
  {
    path: 'carrito',
    loadComponent: () =>
      import('./modules/carrito/carrito.component').then((m) => m.CarritoComponent),
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/checkout/checkout.component').then((m) => m.CheckoutComponent),
  },

  // Cliente
  {
    path: 'cliente/historial',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/cliente/historial/historial.component').then((m) => m.HistorialComponent),
  },
  {
    path: 'cliente/resenas',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/cliente/resenas/resenas.component').then((m) => m.ResenasComponent),
  },
  {
    path: 'cliente/resena/calificar',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/cliente/historial/calificar/CalificarProductoComponent')
      ,
  },
  {
    path: 'cliente/detallepedido',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./modules/cliente/historial/detalle-pedido-component/detalle-pedido-component'),
  },

  // Admin (con layout)
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./modules/admin/admin-layout.component').then((m) => m.AdminLayoutComponent),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./modules/admin/dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'pedidos',
        loadComponent: () =>
          import('./modules/admin/pedidos/pedidos-admin.component').then(
            (m) => m.PedidosAdminComponent,
          ),
      },
      {
        path: 'platos',
        loadComponent: () =>
          import('./modules/admin/platos/platos-admin.component').then(
            (m) => m.PlatosAdminComponent,
          ),
      },
      {
        path: 'inventario',
        loadComponent: () =>
          import('./modules/admin/inventario/inventario-admin.component').then(
            (m) => m.InventarioAdminComponent,
          ),
      },
      {
        path: 'compras',
        loadComponent: () =>
          import('./modules/admin/compras/compras-admin.component').then(
            (m) => m.ComprasAdminComponent,
          ),
      },
      {
        path: 'ventas',
        loadComponent: () =>
          import('./modules/admin/ventas/ventas-admin.component').then(
            (m) => m.VentasAdminComponent,
          ),
      },
      {
        path: 'notificaciones',
        loadComponent: () =>
          import('./modules/admin/notificaciones/notificaciones-admin.component').then(
            (m) => m.NotificacionesAdminComponent,
          ),
      },
    ],
  },

  { path: '**', redirectTo: '' },
];
