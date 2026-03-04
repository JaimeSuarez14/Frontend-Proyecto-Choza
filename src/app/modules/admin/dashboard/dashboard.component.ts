import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="p-6 fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">📊 Dashboard</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">Resumen de ventas y operaciones</p>
        </div>
        <span class="text-sm text-gray-400">{{ hoy }}</span>
      </div>

      <!-- KPI Cards -->
      @if (stats()) {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="card p-5 border-l-4 border-cyan-500">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Total Pedidos</p>
            <p class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ stats()!.kpis.total_pedidos }}</p>
            <p class="text-xs text-cyan-600 mt-1">Todos los tiempos</p>
          </div>
          <div class="card p-5 border-l-4 border-green-500">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Ingresos Totales</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">S/ {{ stats()!.kpis.ingresos_totales | number:'1.2-2' }}</p>
            <p class="text-xs text-green-600 mt-1">Acumulado</p>
          </div>
          <div class="card p-5 border-l-4 border-yellow-500">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Ingresos Hoy</p>
            <p class="text-2xl font-bold text-gray-800 dark:text-gray-100">S/ {{ stats()!.kpis.ingresos_hoy | number:'1.2-2' }}</p>
            <p class="text-xs text-yellow-600 mt-1">{{ hoy }}</p>
          </div>
          <div class="card p-5 border-l-4 border-purple-500">
            <p class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">Clientes</p>
            <p class="text-3xl font-bold text-gray-800 dark:text-gray-100">{{ stats()!.kpis.total_clientes }}</p>
            <p class="text-xs text-purple-600 mt-1">Registrados</p>
          </div>
        </div>

        <!-- Accesos rápidos -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <a routerLink="/admin/pedidos" class="card p-4 flex flex-col items-center gap-2 hover:border-cyan-400 transition-colors cursor-pointer text-center">
            <span class="text-3xl">📦</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Pedidos</span>
            <span class="text-xs text-amber-600 font-semibold">{{ stats()!.kpis.pendientes }} pendientes</span>
          </a>
          <a routerLink="/admin/platos" class="card p-4 flex flex-col items-center gap-2 hover:border-cyan-400 transition-colors cursor-pointer text-center">
            <span class="text-3xl">🍽️</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Platos</span>
            <span class="text-xs text-cyan-600 font-semibold">Gestionar carta</span>
          </a>
          <a routerLink="/admin/inventario" class="card p-4 flex flex-col items-center gap-2 hover:border-cyan-400 transition-colors cursor-pointer text-center">
            <span class="text-3xl">📦</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Inventario</span>
            <span class="text-xs text-green-600 font-semibold">Control stock</span>
          </a>
          <a routerLink="/admin/compras" class="card p-4 flex flex-col items-center gap-2 hover:border-cyan-400 transition-colors cursor-pointer text-center">
            <span class="text-3xl">🛒</span>
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Compras</span>
            <span class="text-xs text-purple-600 font-semibold">Proveedores</span>
          </a>
        </div>

        <div class="grid lg:grid-cols-2 gap-6">
          <!-- Top platos -->
          <div class="card p-5">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
              🏆 Top 5 Platos Más Vendidos
            </h3>
            <div class="space-y-3">
              @for (p of stats()!.productos_top; track p.id_plato; let i = $index) {
                <div class="flex items-center gap-3">
                  <span class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    [class]="i===0?'bg-yellow-400 text-yellow-900':i===1?'bg-gray-300 text-gray-700':'bg-orange-300 text-orange-900'">
                    {{ i + 1 }}
                  </span>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ p.nombre_plato }}</p>
                    <div class="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 mt-1">
                      <div class="bg-cyan-500 h-1.5 rounded-full transition-all"
                           [style.width.%]="(p.cantidad_vendida / stats()!.productos_top[0].cantidad_vendida) * 100"></div>
                    </div>
                  </div>
                  <span class="text-xs font-semibold text-cyan-700 dark:text-cyan-400 flex-shrink-0">{{ p.cantidad_vendida }} und.</span>
                </div>
              }
            </div>
          </div>

          <!-- Clientes frecuentes -->
          <div class="card p-5">
            <h3 class="font-bold text-gray-800 dark:text-gray-100 mb-4">👥 Clientes Frecuentes</h3>
            <div class="space-y-3">
              @for (c of stats()!.clientes_frecuentes; track c.id_cliente) {
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500 to-cyan-700 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {{ c.nombre[0]?.toUpperCase() }}
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{{ c.nombre }}</p>
                    <p class="text-xs text-gray-400">{{ c.numero_pedidos }} pedidos</p>
                  </div>
                  <span class="text-sm font-bold text-green-600 flex-shrink-0">S/ {{ c.gasto_total | number:'1.2-2' }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      } @else {
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          @for (_ of [1,2,3,4]; track $index) {
            <div class="card p-5 animate-pulse h-28"></div>
          }
        </div>
      }
    </div>
  `
})
export class DashboardComponent implements OnInit {
  private api = inject(ApiService);
  stats = signal<any>(null);
  hoy = new Date().toLocaleDateString('es-PE', { day:'2-digit', month:'long', year:'numeric' });

  ngOnInit(): void {
    this.api.getEstadisticas().subscribe({ next: r => this.stats.set(r) });
  }
}
