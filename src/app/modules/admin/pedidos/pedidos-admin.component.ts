import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-pedidos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="p-6 fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">📦 Gestión de Pedidos</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">
            {{ pedidos().length }} pedidos en total
          </p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="card p-4 mb-5 flex flex-wrap gap-3 items-center">
        <input
          type="text"
          [ngModel]="busqueda()"
          (ngModelChange)="busqueda.set($event)"
          placeholder="🔍 Buscar cliente..."
          class="form-input w-48 text-sm"
        />
        <select [(ngModel)]="filtroEstado" class="form-input w-40 text-sm">
          <option value="">Todos los estados</option>
          @for (e of estados; track e.id) {
            <option [value]="e.id">{{ e.nombre }}</option>
          }
        </select>
        <span class="text-sm text-gray-500 dark:text-gray-400 ml-auto">
          Mostrando {{ pedidosFiltrados().length }} pedidos
        </span>
      </div>

      <!-- Tabla -->
      <div class="card overflow-hidden">
        <div class="overflow-x-auto">
          <table class="admin-table">
            <thead>
              <tr>
                <th>#ID</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Método Pago</th>
                <th>Estado</th>
                <th>Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @if (cargando()) {
                @for (_ of [1, 2, 3, 4, 5]; track $index) {
                  <tr>
                    <td colspan="7" class="py-4">
                      <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    </td>
                  </tr>
                }
              }
              @for (p of pedidosFiltrados(); track p.id_pedido) {
                <tr>
                  <td class="font-mono font-bold text-cyan-700 dark:text-cyan-400">
                    #{{ p.id_pedido }}
                  </td>
                  <td>
                    <p class="font-medium">{{ p.cliente_nombre || 'Sin nombre' }}</p>
                    <p class="text-xs text-gray-400">{{ p.cliente_email }}</p>
                  </td>
                  <td class="text-xs">{{ p.fecha_pedido | date: 'dd/MM/yyyy HH:mm' }}</td>
                  <td class="text-xs">{{ p.metodo_pago }}</td>
                  <td>
                    <select
                      [(ngModel)]="p.id_estado"
                      (change)="cambiarEstado(p.id_pedido, +$any($event.target).value)"
                      class="appearance-auto rounded-lg border-0 py-2 pl-4 pr-10 text-sm font-medium ring-1 ring-inset transition-all duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:outline-none cursor-pointer"
                      [ngClass]="{
                        'bg-emerald-500/10 text-emerald-400 ring-emerald-500/30 focus:ring-emerald-500':
                          p.id_estado == 4,
                        'bg-amber-500/10 text-amber-400 ring-amber-500/30 focus:ring-amber-500':
                          p.id_estado == 2,
                        'bg-blue-500/10 text-blue-400 ring-blue-500/30 focus:ring-blue-500':
                          p.id_estado == 1,
                        'bg-gray-500/10 text-gray-300 ring-gray-500/30 focus:ring-white/20':
                          p.id_estado != 4 && p.id_estado != 2 && p.id_estado != 1,
                      }"
                    >
                      @for (e of estados; track e.id) {
                        <option [value]="e.id" class="bg-gray-900 text-white">
                          {{ e.nombre }}
                        </option>
                      }
                    </select>
                  </td>
                  <td class="font-bold text-cyan-700 dark:text-cyan-400">
                    S/ {{ p.monto_total | number: '1.2-2' }}
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <a
                        [routerLink]="['/cliente/detallepedido']" [queryParams]="{ id: p.id_pedido }"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 hover:bg-cyan-100 text-sm"
                      >
                        👁️
                      </a>
                      <button
                        (click)="eliminar(p.id_pedido)"
                        class="w-8 h-8 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100 text-sm"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @if (!cargando() && pedidosFiltrados().length === 0) {
                <tr>
                  <td colspan="7" class="py-10 text-center text-gray-400">
                    No se encontraron pedidos
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
})
export class PedidosAdminComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  pedidos = signal<any[]>([]);
  cargando = signal(true);
  busqueda = signal('');
  filtroEstado = signal('');

  estados = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'En preparacion' },
    { id: 3, nombre: 'Enviado' },
    { id: 4, nombre: 'Entregado' },
    { id: 5, nombre: 'Cancelado' },
  ];

  pedidosFiltrados = computed(() => {
    let lista = this.pedidos();
    if (this.busqueda())
      lista = lista.filter((p) =>
        (p.cliente_nombre || '').toLowerCase().includes(this.busqueda().toLowerCase()),
      );
    if (this.filtroEstado()) lista = lista.filter((p) => p.id_estado == +this.filtroEstado());
    return lista;
  });

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando.set(true);
    this.api.getPedidos().subscribe({
      next: (r) => {
        this.pedidos.set(r.pedidos);
        this.cargando.set(false);
      },
    });
  }

  cambiarEstado(id: number, estado: number): void {
    this.api.cambiarEstado(id, estado).subscribe({
      next: () => {
        this.toast.success('Estado actualizado');
        this.cargar();
      },
      error: () => this.toast.error('Error al actualizar estado'),
    });
  }

  eliminar(id: number): void {
    if (!confirm(`¿Eliminar pedido #${id}?`)) return;
    this.api.eliminarPedido(id).subscribe({
      next: () => {
        this.toast.success('Pedido eliminado');
        this.cargar();
      },
      error: () => this.toast.error('Error al eliminar'),
    });
  }
}
