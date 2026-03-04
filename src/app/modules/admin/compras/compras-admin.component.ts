import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ selector: 'app-compras-admin', standalone: true, imports: [CommonModule, FormsModule],
template: `
  <div class="p-6 fade-in">
    <div class="flex items-center justify-between mb-6">
      <div><h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">🛒 Compras y Proveedores</h1>
      <p class="text-sm text-gray-500">{{ ordenes().length }} órdenes registradas</p></div>
      <button (click)="modalOrden.set(true)" class="btn-ocean">➕ Nueva Orden</button>
    </div>
    <div class="card overflow-hidden mb-6">
      <table class="admin-table"><thead><tr><th>#</th><th>Proveedor</th><th>Fecha</th><th>Estado</th><th>Total</th><th>Acciones</th></tr></thead>
      <tbody>
        @for (o of ordenes(); track o.id_orden) {
          <tr>
            <td class="font-mono font-bold text-cyan-700">#{{ o.id_orden }}</td>
            <td>{{ o.proveedor }}</td>
            <td class="text-xs">{{ o.fecha_orden | date:'dd/MM/yyyy' }}</td>
            <td><span class="estado-badge" [class]="estadoClase(o.estado)">{{ o.estado }}</span></td>
            <td class="font-bold text-cyan-700">S/ {{ o.monto_total | number:'1.2-2' }}</td>
            <td>
              @if (o.estado === 'pendiente') {
                <button (click)="aprobar(o.id_orden)" class="btn-ocean text-xs px-2 py-1">✅ Aprobar</button>
              }
              @if (o.estado === 'aprobada') {
                <button (click)="recibir(o.id_orden)" class="btn-gold text-xs px-2 py-1">📥 Recibir</button>
              }
            </td>
          </tr>
        }
      </tbody></table>
    </div>
  </div>
  @if (modalOrden()) {
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="modalOrden.set(false)">
      <div class="card w-full max-w-lg p-6" (click)="stopProp($event)">
        <h2 class="font-bold text-xl mb-4 text-gray-800 dark:text-gray-100">Nueva Orden de Compra</h2>
        <div class="space-y-3">
          <div><label class="form-label">Proveedor</label>
            <select [(ngModel)]="nuevaOrden.id_proveedor" class="form-input">
              <option value="">Seleccionar...</option>
              @for (p of proveedores(); track p.id_proveedor) { <option [value]="p.id_proveedor">{{ p.nombre }}</option> }
            </select>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ítems</p>
            @for (item of nuevaOrden.items; track $index; let i = $index) {
              <div class="grid grid-cols-3 gap-2 mb-2">
                <input type="text" [(ngModel)]="item.nombre_insumo" placeholder="Insumo" class="form-input text-xs col-span-1">
                <input type="number" [(ngModel)]="item.cantidad" placeholder="Cant." class="form-input text-xs">
                <input type="number" [(ngModel)]="item.precio_unitario" placeholder="Precio" class="form-input text-xs">
              </div>
            }
            <button (click)="agregarItem()" class="text-xs text-cyan-700 hover:underline">+ Agregar ítem</button>
          </div>
          <div class="flex gap-3 pt-2">
            <button (click)="modalOrden.set(false)" class="btn-outline flex-1">Cancelar</button>
            <button (click)="crearOrden()" class="btn-ocean flex-1">Crear Orden</button>
          </div>
        </div>
      </div>
    </div>
  }
`})
export class ComprasAdminComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  ordenes = signal<any[]>([]);
  proveedores = signal<any[]>([]);
  modalOrden = signal(false);
  nuevaOrden: any = { id_proveedor: '', items: [{ nombre_insumo:'', cantidad:0, precio_unitario:0 }] };

  ngOnInit(): void { this.cargar(); this.api.getProveedores().subscribe({ next: r => this.proveedores.set(r.proveedores) }); }
  cargar(): void { this.api.getOrdenes().subscribe({ next: r => this.ordenes.set(r.ordenes) }); }
  agregarItem(): void { this.nuevaOrden.items.push({ nombre_insumo:'', cantidad:0, precio_unitario:0 }); }
  estadoClase(e: string): string { const m: any = { pendiente:'bg-amber-100 text-amber-800', aprobada:'bg-blue-100 text-blue-800', recibida:'bg-green-100 text-green-800', cancelada:'bg-red-100 text-red-800' }; return m[e] || ''; }
  aprobar(id: number): void { this.api.aprobarOrden(id).subscribe({ next: () => { this.toast.success('Orden aprobada'); this.cargar(); } }); }
  recibir(id: number): void { this.api.recibirOrden(id).subscribe({ next: () => { this.toast.success('Orden recibida, stock actualizado'); this.cargar(); } }); }
  crearOrden(): void {
    this.api.crearOrden(this.nuevaOrden).subscribe({ next: () => { this.toast.success('Orden creada'); this.modalOrden.set(false); this.cargar(); }, error: () => this.toast.error('Error') });
  }
  stopProp(e: Event): void { e.stopPropagation(); }
}
