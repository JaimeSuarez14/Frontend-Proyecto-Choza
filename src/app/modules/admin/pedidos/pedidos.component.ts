// src/app/modules/admin/pedidos/pedidos.component.ts
import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { Pedido } from '../../../core/interfaces/pedido';

@Component({
  selector: 'app-admin-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
  <div class="space-y-4">

    <!-- Filtros -->
    <div class="card-choza rounded-xl p-4 flex flex-wrap gap-3 items-center">
      <input [(ngModel)]="busqueda"
             placeholder="Buscar cliente o pedido..."
             class="input-choza max-w-xs">
      <select [(ngModel)]="estadoFiltro" class="input-choza max-w-48">
        <option value="">Todos los estados</option>
        @for (e of estados; track e.id) {
          <option [value]="e.nombre">{{ e.nombre }}</option>
        }
      </select>
      <button (click)="cargar()" class="btn-secondary-choza flex items-center gap-2 text-sm">
        <i class="fa-solid fa-rotate" [class.animate-spin]="loading()"></i> Actualizar
      </button>
    </div>

    <!-- Tabla (igual a admin_pedidos.php) -->
    <div class="card-choza rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        @if (loading()) {
          <div class="p-8 text-center text-gray-400">
            <i class="fa-solid fa-spinner animate-spin text-2xl"></i>
          </div>
        } @else {
          <table class="table-choza">
            <thead><tr>
              <th>ID</th><th>Cliente</th><th>Fecha</th>
              <th>Pago</th><th>Estado</th><th>Total</th><th>Acciones</th>
            </tr></thead>
            <tbody>
              @for (p of pedidosFiltrados(); track p.id_pedido) {
                <tr>
                  <td class="font-mono font-bold">#{{ p.id_pedido }}</td>
                  <td>
                    <div class="font-medium">{{ p.cliente.nombre }}</div>
                    <div class="text-xs text-gray-400">{{ p.cliente.email }}</div>
                  </td>
                  <td class="text-sm">{{ p.fecha_pedido | date:'dd/MM/yy HH:mm' }}</td>
                  <td class="text-sm">{{ p.pago.nombre }}</td>
                  <td>
                    <span class="text-xs font-semibold px-2 py-1 rounded-full"
                          [ngClass]="badgeClass(p.estado.nombre)">
                      {{ p.estado }}
                    </span>
                  </td>
                  <td class="font-bold">S/. {{ p.monto_total | number:'1.2-2' }}</td>
                  <td>
                    <div class="flex gap-1">
                      <button (click)="verDetalle(p)"
                              class="w-7 h-7 flex items-center justify-center rounded-lg
                                     bg-gray-100 dark:bg-gray-700 hover:bg-primary-100
                                     text-gray-600 dark:text-gray-300 transition-colors"
                              title="Ver detalle">
                        <i class="fa-solid fa-eye text-xs"></i>
                      </button>
                      <button (click)="pedidoEditar.set(p)"
                              class="w-7 h-7 flex items-center justify-center rounded-lg
                                     bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100
                                     text-blue-600 transition-colors"
                              title="Cambiar estado">
                        <i class="fa-solid fa-pen text-xs"></i>
                      </button>
                      <button (click)="eliminar(p.id_pedido)"
                              class="w-7 h-7 flex items-center justify-center rounded-lg
                                     bg-red-50 dark:bg-red-900/20 hover:bg-red-100
                                     text-red-600 transition-colors"
                              title="Eliminar">
                        <i class="fa-solid fa-trash text-xs"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
              @empty {
                <tr><td colspan="7" class="text-center py-10 text-gray-400">
                  No hay pedidos
                </td></tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  </div>

  <!-- Modal detalle pedido -->
  @if (pedidoDetalle()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         (click)="pedidoDetalle.set(null)">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full
                  shadow-2xl animate-slide-up max-h-[80vh] overflow-y-auto"
           (click)="$event.stopPropagation()">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-lg dark:text-white">Pedido #{{ pedidoDetalle()!.id_pedido }}</h3>
          <button (click)="pedidoDetalle.set(null)" class="text-gray-400 hover:text-gray-600">
            <i class="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        <div class="space-y-3 text-sm">
          <div class="grid grid-cols-2 gap-2 text-gray-600 dark:text-gray-400">
            <div><b>Cliente:</b> {{ pedidoDetalle()!.cliente_nombre }}</div>
            <div><b>Email:</b> {{ pedidoDetalle()!.cliente_email }}</div>
            <div><b>Pago:</b> {{ pedidoDetalle()!.metodo_pago }}</div>
            <div><b>Estado:</b> {{ pedidoDetalle()!.estado }}</div>
            @if (pedidoDetalle()!.notas) {
              <div class="col-span-2"><b>Notas:</b> {{ pedidoDetalle()!.notas }}</div>
            }
          </div>
          @if (pedidoDetalle()!.items?.length) {
            <table class="table-choza mt-2">
              <thead><tr><th>Plato</th><th>Cant.</th><th>Subtotal</th></tr></thead>
              <tbody>
                @for (item of pedidoDetalle()!.items; track item.id_detalle) {
                  <tr>
                    <td>{{ item.nombre_plato }}</td>
                    <td>{{ item.cantidad }}</td>
                    <td>S/. {{ item.subtotal | number:'1.2-2' }}</td>
                  </tr>
                }
              </tbody>
            </table>
          }
          <div class="text-right font-bold text-lg dark:text-white">
            Total: S/. {{ pedidoDetalle()!.monto_total | number:'1.2-2' }}
          </div>
        </div>
      </div>
    </div>
  }

  <!-- Modal cambiar estado -->
  @if (pedidoEditar()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
         (click)="pedidoEditar.set(null)">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up"
           (click)="$event.stopPropagation()">
        <h3 class="font-bold text-lg dark:text-white mb-4">
          Actualizar Estado — Pedido #{{ pedidoEditar()!.id_pedido }}
        </h3>
        <select [(ngModel)]="nuevoEstado" class="input-choza mb-4">
          @for (e of estados; track e.id) {
            <option [value]="e.id">{{ e.nombre }}</option>
          }
        </select>
        <div class="flex gap-2">
          <button (click)="guardarEstado()" class="btn-primary-choza flex-1">
            <i class="fa-solid fa-check mr-1"></i> Guardar
          </button>
          <button (click)="pedidoEditar.set(null)" class="btn-secondary-choza flex-1">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  }
  `
})
export class AdminPedidosComponent implements OnInit {
  private api = inject(ApiService);

  pedidos       = signal<Pedido[]>([]);
  loading       = signal(true);
  busqueda      = '';
  estadoFiltro  = '';
  pedidoDetalle = signal<Pedido | null>(null);
  pedidoEditar  = signal<Pedido | null>(null);
  nuevoEstado   = 1;

  readonly estados = [
    { id: 1, nombre: 'Pendiente' },
    { id: 2, nombre: 'En preparacion' },
    { id: 3, nombre: 'Enviado' },
    { id: 4, nombre: 'Entregado' },
    { id: 5, nombre: 'Cancelado' },
  ];

  pedidosFiltrados = computed(() =>
    this.pedidos().filter(p => {
      const bOk = !this.busqueda ||
        p.cliente.nombre?.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        String(p.id_pedido).includes(this.busqueda);
      const eOk = !this.estadoFiltro || p.estado.nombre === this.estadoFiltro;
      return bOk && eOk;
    })
  );

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.loading.set(true);
    this.api.getPedidos().subscribe({
      next: res => { this.pedidos.set(res.pedidos); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  verDetalle(p: Pedido): void {
    this.api.getPedido(p.id_pedido).subscribe(res => this.pedidoDetalle.set(res.pedido));
  }

  guardarEstado(): void {
    const p = this.pedidoEditar();
    if (!p) return;
    this.api.cambiarEstadoPedido(p.id_pedido, this.nuevoEstado).subscribe(() => {
      this.pedidoEditar.set(null);
      this.cargar();
    });
  }

  eliminar(id: number): void {
    if (!confirm(`¿Eliminar pedido #${id}?`)) return;
    this.api.eliminarPedido(id).subscribe(() => this.cargar());
  }

  badgeClass(estado: string): string {
    const map: Record<string, string> = {
      'Pendiente':      'badge-pendiente',
      'En preparacion': 'badge-preparacion',
      'Enviado':        'badge-enviado',
      'Entregado':      'badge-entregado',
      'Cancelado':      'badge-cancelado',
    };
    return map[estado] ?? 'badge-pendiente';
  }
}
