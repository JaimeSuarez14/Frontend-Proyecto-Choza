import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <!-- Hero Banner (como el original) -->
    <section class="relative overflow-hidden min-h-72 flex flex-col justify-center text-white"
      style="background: linear-gradient(rgba(0,60,92,0.75), rgba(0,96,100,0.85)), url('/assets/choza.jpg') center/cover;">
      <div class="max-w-7xl mx-auto px-6 py-16 fade-in">
        <h1 class="text-4xl md:text-5xl font-bold mb-4 text-white drop-shadow-lg">
          🌊 Bienvenido a La Choza Náutica
        </h1>
        <p class="text-lg text-cyan-100 mb-6 max-w-xl">
          Los sabores del mar directo a tu mesa. Ordena en línea nuestros platos tradicionales peruanos.
        </p>
        <div class="flex gap-3 flex-wrap">
          <a routerLink="/menu" class="btn-gold px-6 py-3 text-base rounded-xl shadow-lg hover:scale-105 transition-transform">
            🍽️ Ver Menú completo
          </a>
          <a routerLink="/nosotros" class="px-6 py-3 rounded-xl border-2 border-white text-white hover:bg-white hover:text-cyan-900 font-semibold transition-all text-base">
            Conócenosss
          </a>
        </div>
      </div>
    </section>

    <!-- Stats rápidas -->
    <section class="bg-cyan-700 dark:bg-cyan-900 text-white py-8">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div><p class="text-3xl font-bold text-yellow-400">50+</p><p class="text-sm text-cyan-200">Platos en carta</p></div>
        <div><p class="text-3xl font-bold text-yellow-400">4</p><p class="text-sm text-cyan-200">Métodos de pago</p></div>
        <div><p class="text-3xl font-bold text-yellow-400">⭐ 4.8</p><p class="text-sm text-cyan-200">Calificación</p></div>
        <div><p class="text-3xl font-bold text-yellow-400">100%</p><p class="text-sm text-cyan-200">Sabor marino</p></div>
      </div>
    </section>

    <!-- Platos Destacados -->
    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100">🌟 Platos Destacados</h2>
          <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Los favoritos de nuestros clientes</p>
        </div>
        <a routerLink="/menu" class="btn-outline text-sm hidden sm:flex items-center gap-1">
          Ver todos →
        </a>
      </div>

      @if (cargando()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (_ of [1,2,3,4,5,6]; track $index) {
            <div class="card animate-pulse h-72">
              <div class="bg-gray-200 dark:bg-gray-700 h-44 rounded-t-2xl"></div>
              <div class="p-4 space-y-2">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          }
        </div>
      } @else {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (p of destacados(); track p.id_plato) {
            <div class="card-hover overflow-hidden fade-in">
              <div class="relative overflow-hidden h-44">
                <img [src]="imgUrl(p.imagen)" [alt]="p.nombre_plato"
                     class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                     (error)="onImgError($event)">
                <span class="absolute top-2 left-2 bg-cyan-700 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {{ p.categoria }}
                </span>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-gray-800 dark:text-gray-100 mb-1">{{ p.nombre_plato }}</h3>
                <p class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mb-3">{{ p.descripcion }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-lg font-bold text-cyan-700 dark:text-cyan-400">
                    S/ {{ p.precio | number:'1.2-2' }}
                  </span>
                  <button (click)="agregar(p)"
                    class="btn-ocean text-xs px-3 py-1.5 rounded-lg">
                    🛒 Agregar
                  </button>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </section>

    <!-- Categorías -->
    <section class="bg-gray-50 dark:bg-gray-800/50 py-10">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">Nuestras Categorías</h2>
        <div class="flex flex-wrap gap-3 justify-center">
          @for (cat of categorias; track cat.emoji) {
            <a routerLink="/menu" [queryParams]="{categoria: cat.nombre}"
               class="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-gray-800 shadow-sm
                      border border-gray-100 dark:border-gray-700 hover:border-cyan-400
                      hover:shadow-md transition-all text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ cat.emoji }} {{ cat.nombre }}
            </a>
          }
        </div>
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  private api     = inject(ApiService);
  private carrito = inject(CarritoService);
  private toast   = inject(ToastService);

  destacados = signal<any[]>([]);
  cargando   = signal(true);

  categorias = [
    { emoji: '🐟', nombre: 'Ceviches y Especiales' },
    { emoji: '🍚', nombre: 'Arroces' },
    { emoji: '🍽️', nombre: 'Platos Criollos' },
    { emoji: '🦑', nombre: 'Tiraditos y Leches' },
    { emoji: '🥗', nombre: 'Entradas' },
    { emoji: '🍹', nombre: 'Bebidas' },
  ];

  ngOnInit(): void {
    this.api.getPlatos().subscribe({
      next: res => {
        this.destacados.set(res.platos.slice(0, 6));
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  agregar(p: any): void {
    this.carrito.agregar({ id_plato: p.id_plato, nombre_plato: p.nombre_plato, precio: p.precio, imagen: p.imagen });
    this.toast.success(`✅ ${p.nombre_plato} agregado al carrito`);
  }

  imgUrl(img: string): string {
    return img ? `http://localhost:8080/uploads/platos/${img}` : '/assets/noimage.jpg';
  }

  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = '/assets/noimage.jpg';
  }
}
