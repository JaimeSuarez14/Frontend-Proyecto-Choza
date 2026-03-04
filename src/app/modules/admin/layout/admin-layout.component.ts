// src/app/modules/admin/layout/admin-layout.component.ts
import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
  <div class="flex h-screen bg-gray-100 dark:bg-gray-950">

    <!-- Sidebar -->
    <aside [class.w-64]="sidebarOpen()"
           [class.w-16]="!sidebarOpen()"
           class="bg-ocean text-white flex-shrink-0 transition-all duration-300
                  flex flex-col shadow-xl z-40">

      <!-- Header sidebar -->
      <div class="flex items-center justify-between px-4 py-4 border-b border-white/10">
        @if (sidebarOpen()) {
          <span class="font-bold text-gold text-lg tracking-tight animate-fade-in">
            Panel Admin
          </span>
        }
        <button (click)="sidebarOpen.update(v=>!v)"
                class="w-8 h-8 flex items-center justify-center rounded-lg
                       hover:bg-white/10 transition-colors ml-auto">
          <i class="fa-solid" [class.fa-bars]="!sidebarOpen()" [class.fa-chevron-left]="sidebarOpen()"></i>
        </button>
      </div>

      <!-- Perfil admin -->
      @if (sidebarOpen()) {
        <div class="px-4 py-3 border-b border-white/10">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center flex-shrink-0">
              <i class="fa-solid fa-user-shield text-gold text-xs"></i>
            </div>
            <div class="overflow-hidden">
              <p class="text-xs font-semibold truncate">{{ auth.nombreUsuario() }}</p>
              <p class="text-xs text-white/50 capitalize">{{ "default" }}</p>
            </div>
          </div>
        </div>
      }

      <!-- Nav links -->
      <nav class="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        @for (link of navLinks; track link.route) {
          <a [routerLink]="link.route" routerLinkActive="bg-white/20 text-gold"
             class="flex items-center gap-3 px-3 py-2.5 rounded-lg
                    text-gray-300 hover:bg-white/10 hover:text-white
                    transition-all duration-200 group"
             [title]="!sidebarOpen() ? link.label : ''">
            <i [class]="'fa-solid ' + link.icon + ' w-5 text-center flex-shrink-0'"></i>
            @if (sidebarOpen()) {
              <span class="text-sm font-medium animate-fade-in">{{ link.label }}</span>
              @if (link.badge) {
                <span class="ml-auto bg-red-500 text-white text-xs rounded-full
                             w-5 h-5 flex items-center justify-center">
                  {{ link.badge }}
                </span>
              }
            }
          </a>
        }
      </nav>

      <!-- Footer sidebar -->
      <div class="p-2 border-t border-white/10">
        <a routerLink="/"
           class="flex items-center gap-3 px-3 py-2.5 rounded-lg
                  text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
           [title]="!sidebarOpen() ? 'Ir a la tienda' : ''">
          <i class="fa-solid fa-store w-5 text-center flex-shrink-0"></i>
          @if (sidebarOpen()) { <span class="text-sm">Ver tienda</span> }
        </a>
        <button (click)="auth.logout()"
                class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-red-400 hover:bg-red-500/10 transition-colors"
                [title]="!sidebarOpen() ? 'Cerrar sesión' : ''">
          <i class="fa-solid fa-arrow-right-from-bracket w-5 text-center flex-shrink-0"></i>
          @if (sidebarOpen()) { <span class="text-sm">Cerrar sesión</span> }
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Top bar -->
      <div class="sticky top-0 z-30 bg-white dark:bg-gray-900
                  border-b border-gray-200 dark:border-gray-700 px-6 py-3
                  flex items-center justify-between shadow-sm">
        <h1 class="font-semibold text-gray-800 dark:text-white">
          {{ pageTitle() }}
        </h1>
        <div class="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <i class="fa-regular fa-calendar"></i>
          {{ today }}
        </div>
      </div>

      <div class="p-6">
        <router-outlet></router-outlet>
      </div>
    </main>
  </div>
  `
})
export class AdminLayoutComponent {
  auth = inject(AuthService);
  private router = inject(Router);

  sidebarOpen = signal(true);
  pageTitle   = signal('Dashboard');
  today = new Date().toLocaleDateString('es-PE', { weekday:'long', year:'numeric', month:'long', day:'numeric' });

  readonly navLinks = [
    { route: '/admin',           icon: 'fa-sliders',       label: 'Dashboard',   badge: null },
    { route: '/admin/platos',    icon: 'fa-bowl-rice',     label: 'Platos',      badge: null },
    { route: '/admin/pedidos',   icon: 'fa-square-pen',    label: 'Pedidos',     badge: null },
    { route: '/admin/inventario',icon: 'fa-jar-wheat',     label: 'Inventario',  badge: null },
    { route: '/admin/compras',   icon: 'fa-cart-shopping', label: 'Compras',     badge: null },
  ];

  constructor() {
    this.router.events.pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;
        const link = this.navLinks.find(l => url.startsWith(l.route) && l.route !== '/admin')
          ?? this.navLinks.find(l => l.route === '/admin');
        this.pageTitle.set(link?.label ?? 'Admin');
      });
  }
}
