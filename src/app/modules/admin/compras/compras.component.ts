import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { OrdenCompra } from '../../../core/interfaces/ordenCompra';
import { Proveedor } from '../../../core/interfaces/proveedor';


@Component({
  selector: 'app-admin-compras', standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-xl font-bold dark:text-white">Órdenes de Compra</h2>
      <button (click)="crearModal.set(true)" class="btn-primary-choza flex items-center gap-2 text-sm">
        <i class="fa-solid fa-plus"></i> Nueva Orden
      </button>
    </div>

    <div class="card-choza rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        @if (loading()) {
          <div class="p-8 text-center text-gray-400"><i class="fa-solid fa-spinner animate-spin text-2xl"></i></div>
        } @else {
          <table class="table-choza">
            <thead><tr><th>#</th><th>Proveedor</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Acción</th></tr></thead>
            <tbody>
              @for (o of ordenes(); track o.id_orden) {
                <tr>
                  <td class="font-mono font-bold">#{{ o.id_orden }}</td>
                  <td>{{ o.proveedor }}</td>
                  <td class="text-sm">{{ o.fecha_orden | date:'dd/MM/yy' }}</td>
                  <td>
                    <span class="text-xs font-semibold px-2 py-0.5 rounded-full"
                          [ngClass]="{'badge-pendiente': o.estado==='pendiente','badge-preparacion': o.estado==='aprobada','badge-entregado': o.estado==='recibida','badge-cancelado': o.estado==='cancelada'}">
                      {{ o.estado }}
                    </span>
                  </td>
                  <td class="font-bold">S/. {{ o.monto_total | number:'1.2-2' }}</td>
                  <td>
                    <div class="flex gap-1">
                      @if (o.estado === 'pendiente') {
                        <button (click)="aprobar(o.id_orden)" class="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-lg hover:bg-yellow-200 transition-colors">Aprobar</button>
                      }
                      @if (o.estado === 'aprobada') {
                        <button (click)="recibir(o.id_orden)" class="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-lg hover:bg-green-200 transition-colors">Recibir</button>
                      }
                    </div>
                  </td>
                </tr>
              }
              @empty {
                <tr><td colspan="6" class="text-center py-10 text-gray-400">No hay órdenes registradas</td></tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  </div>

  <!-- Modal nueva orden -->
  @if (crearModal()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="crearModal.set(false)">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto" (click)="$event.stopPropagation()">
        <h3 class="font-bold text-lg dark:text-white mb-4">Nueva Orden de Compra</h3>
        <div class="space-y-3">
          <select [(ngModel)]="ordenForm.id_proveedor" class="input-choza">
            <option value="0">Seleccionar proveedor</option>
            @for (p of proveedores(); track p.id_proveedor) { <option [value]="p.id_proveedor">{{ p.nombre }}</option> }
          </select>
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">Ítems de la orden:</p>
            @for (item of ordenForm.items; track $index; let i = $index) {
              <div class="flex gap-2 items-center">
                <input [(ngModel)]="item.nombre_insumo" class="input-choza flex-1 text-sm" placeholder="Nombre insumo">
                <input type="number" [(ngModel)]="item.cantidad" class="input-choza w-20 text-sm" placeholder="Cant.">
                <input type="number" [(ngModel)]="item.precio_unitario" class="input-choza w-24 text-sm" placeholder="Precio">
                <button (click)="ordenForm.items.splice(i,1)" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-xmark"></i></button>
              </div>
            }
            <button (click)="ordenForm.items.push({nombre_insumo:'',cantidad:1,precio_unitario:0})"
                    class="text-sm text-primary-900 dark:text-primary-300 hover:underline flex items-center gap-1">
              <i class="fa-solid fa-plus"></i> Agregar ítem
            </button>
          </div>
        </div>
        <div class="flex gap-2 mt-4">
          <button (click)="guardarOrden()" class="btn-primary-choza flex-1">Crear Orden</button>
          <button (click)="crearModal.set(false)" class="btn-secondary-choza flex-1">Cancelar</button>
        </div>
      </div>
    </div>
  }`
})
export class AdminComprasComponent implements OnInit {
  private api = inject(ApiService);
  ordenes     = signal<OrdenCompra[]>([]);
  proveedores = signal<Proveedor[]>([]);
  loading     = signal(true);
  crearModal  = signal(false);
  ordenForm   = { id_proveedor: 0, items: [{ nombre_insumo: '', cantidad: 1, precio_unitario: 0 }] };

  ngOnInit(): void { this.cargar(); this.api.getProveedores().subscribe(r => this.proveedores.set(r.proveedores)); }
  cargar(): void {
    this.loading.set(true);
    this.api.getOrdenes().subscribe({ next: r => { this.ordenes.set(r.ordenes); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
  guardarOrden(): void {
    this.api.crearOrden(this.ordenForm).subscribe(() => { this.crearModal.set(false); this.cargar(); });
  }
  aprobar(id: number): void { this.api.aprobarOrden(id).subscribe(() => this.cargar()); }
  recibir(id: number): void { if (!confirm('¿Confirmar recepción y actualizar inventario?')) return; this.api.recibirOrden(id).subscribe(() => this.cargar()); }
}
