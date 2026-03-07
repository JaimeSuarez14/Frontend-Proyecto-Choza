import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <!-- Sidebar -->
      <aside
        [class.w-64]="sidebarOpen()"
        [class.w-16]="!sidebarOpen()"
        class="bg-cyan-950 dark:bg-gray-950 flex flex-col transition-all duration-300 shrink-0"
      >
        <!-- Logo -->
        <div class="h-16 flex items-center px-4 border-b border-cyan-900/50">
          @if (sidebarOpen()) {
            <div class="flex items-center gap-3">
              <span class="text-2xl">🐟</span>
              <div>
                <p class="text-white font-bold text-sm leading-none">La Choza</p>
                <p class="text-cyan-400 text-xs">Panel Admin</p>
              </div>
            </div>
          } @else {
            <span class="text-2xl mx-auto">🐟</span>
          }
        </div>

        <!-- Nav links -->
        <nav class="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
          @for (link of links; track link.ruta) {
            <a
              [routerLink]="link.ruta"
              routerLinkActive="bg-cyan-700 text-white"
              [routerLinkActiveOptions]="link.exact ? { exact: true } : {}"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                      text-cyan-200 hover:bg-cyan-800/50 hover:text-white transition-all"
              [title]="!sidebarOpen() ? link.label : ''"
            >
              <span class="text-lg shrink-0">{{ link.icon }}</span>
              @if (sidebarOpen()) {
                <span>{{ link.label }}</span>
              }
            </a>
          }
        </nav>

        <!-- Toggle + User -->
        <div class="border-t border-cyan-900/50 p-3 space-y-2">
          <button
            (click)="sidebarOpen.set(!sidebarOpen())"
            class="w-full flex items-center justify-center p-2 rounded-xl text-cyan-400
                   hover:bg-cyan-800/50 hover:text-white transition-all"
          >
            {{ sidebarOpen() ? '◀' : '▶' }}
          </button>
          @if (sidebarOpen()) {
            <div class="flex items-center gap-2 px-2">
              <div
                class="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-sm font-bold shrink-0"
              >
                {{ auth.nombreUsuario()[0]?.toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="text-white text-xs font-medium truncate">{{ auth.nombreUsuario() }}</p>
                <p class="text-cyan-400 text-xs capitalize">{{ auth.user()?.rol }}</p>
              </div>
            </div>
          }
        </div>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  sidebarOpen = signal(true);

  links = [
    { icon: '📊', label: 'Dashboard', ruta: '/admin', exact: true },
    { icon: '📦', label: 'Pedidos', ruta: '/admin/pedidos', exact: false },
    { icon: '🍽️', label: 'Platos', ruta: '/admin/platos', exact: false },
    { icon: '🏪', label: 'Inventario', ruta: '/admin/inventario', exact: false },
    { icon: '🛒', label: 'Compras', ruta: '/admin/compras', exact: false },
    { icon: '📈', label: 'Ventas', ruta: '/admin/ventas', exact: false },
    { icon: '📈', label: 'Personas', ruta: '/admin/personas', exact: false },
    { icon: '🔔', label: 'Notificaciones', ruta: '/admin/notificaciones', exact: false },
    { icon: '🏠', label: 'Ir al sitio', ruta: '/', exact: true },
  ];
}
