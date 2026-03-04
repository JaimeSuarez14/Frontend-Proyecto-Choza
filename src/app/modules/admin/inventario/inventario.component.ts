import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Inventario } from '../../../core/interfaces/inventario';

@Component({
  selector: 'app-admin-inventario', standalone: true, imports: [CommonModule, FormsModule],
  template: `
  <div class="space-y-4">
    <div class="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h2 class="text-xl font-bold dark:text-white">Gestión de Inventario</h2>
        <p class="text-sm text-gray-500 dark:text-gray-400">Control de insumos y existencias en tiempo real</p>
      </div>
      <div class="flex gap-2">
        @if (bajosStock() > 0) {
          <span class="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
            <i class="fa-solid fa-triangle-exclamation"></i> {{ bajosStock() }} bajo stock
          </span>
        }
        <button (click)="nuevoModal.set(true)" class="btn-primary-choza flex items-center gap-2 text-sm">
          <i class="fa-solid fa-plus"></i> Nuevo Insumo
        </button>
      </div>
    </div>

    <div class="card-choza rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        @if (loading()) {
          <div class="p-8 text-center text-gray-400"><i class="fa-solid fa-spinner animate-spin text-2xl"></i></div>
        } @else {
          <table class="table-choza">
            <thead><tr><th>Insumo</th><th>Stock Actual</th><th>Mínimo</th><th>Unidad</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              @for (item of inventario(); track item.id_inventario) {
                <tr>
                  <td class="font-medium">{{ item.nombre_insumo }}</td>
                  <td [class.text-red-600]="item.bajo_stock" [class.font-bold]="item.bajo_stock">{{ item.stock_actual }}</td>
                  <td class="text-gray-500 text-sm">{{ item.stock_minimo }}</td>
                  <td class="text-sm">{{ item.unidad }}</td>
                  <td>
                    @if (item.bajo_stock) {
                      <span class="badge-cancelado text-xs px-2 py-0.5 rounded-full font-medium"><i class="fa-solid fa-exclamation-triangle mr-1"></i>Reponer</span>
                    } @else {
                      <span class="badge-entregado text-xs px-2 py-0.5 rounded-full font-medium"><i class="fa-solid fa-check-circle mr-1"></i>OK</span>
                    }
                  </td>
                  <td>
                    <div class="flex gap-1">
                      <button (click)="movimientoItem.set(item)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors" title="Movimiento">
                        <i class="fa-solid fa-arrows-up-down text-xs"></i></button>
                      <button (click)="eliminar(item.id_inventario)" class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors">
                        <i class="fa-solid fa-trash text-xs"></i></button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div>
    </div>
  </div>

  <!-- Modal nuevo insumo -->
  @if (nuevoModal()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="nuevoModal.set(false)">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up" (click)="$event.stopPropagation()">
        <h3 class="font-bold text-lg dark:text-white mb-4">Nuevo Insumo</h3>
        <div class="space-y-3">
          <input [(ngModel)]="nuevoForm.nombre_insumo" class="input-choza" placeholder="Nombre del insumo">
          <div class="grid grid-cols-2 gap-2">
            <input type="number" [(ngModel)]="nuevoForm.stock_actual" class="input-choza" placeholder="Stock inicial">
            <input type="number" [(ngModel)]="nuevoForm.stock_minimo" class="input-choza" placeholder="Stock mínimo">
          </div>
          <select [(ngModel)]="nuevoForm.unidad" class="input-choza">
            <option value="">Unidad de medida</option>
            @for (u of unidades; track u) { <option [value]="u">{{ u }}</option> }
          </select>
        </div>
        <div class="flex gap-2 mt-4">
          <button (click)="guardarNuevo()" class="btn-primary-choza flex-1">Guardar</button>
          <button (click)="nuevoModal.set(false)" class="btn-secondary-choza flex-1">Cancelar</button>
        </div>
      </div>
    </div>
  }

  <!-- Modal movimiento -->
  @if (movimientoItem()) {
    <div class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" (click)="movimientoItem.set(null)">
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-slide-up" (click)="$event.stopPropagation()">
        <h3 class="font-bold text-lg dark:text-white mb-1">Movimiento de Stock</h3>
        <p class="text-sm text-gray-500 mb-4">{{ movimientoItem()!.nombre_insumo }}</p>
        <div class="space-y-3">
          <select [(ngModel)]="movForm.tipo" class="input-choza">
            <option value="entrada">Entrada (compra)</option>
            <option value="salida">Salida (consumo)</option>
            <option value="ajuste">Ajuste</option>
          </select>
          <input type="number" [(ngModel)]="movForm.cantidad" class="input-choza" placeholder="Cantidad">
          <input [(ngModel)]="movForm.motivo" class="input-choza" placeholder="Motivo">
        </div>
        <div class="flex gap-2 mt-4">
          <button (click)="guardarMovimiento()" class="btn-primary-choza flex-1">Registrar</button>
          <button (click)="movimientoItem.set(null)" class="btn-secondary-choza flex-1">Cancelar</button>
        </div>
      </div>
    </div>
  }`
})
export class AdminInventarioComponent implements OnInit {
  private api = inject(ApiService);
  inventario     = signal<Inventario[]>([]);
  loading        = signal(true);
  nuevoModal     = signal(false);
  movimientoItem = signal<Inventario | null>(null);
  bajosStock     = computed(() => this.inventario().filter(i => i.stock_minimo).length);
  nuevoForm = { nombre_insumo: '', stock_actual: 0, stock_minimo: 0, unidad: '' };
  movForm   = { tipo: 'entrada', cantidad: 0, motivo: '' };
  readonly unidades = ['kg','litros','unidad','pinch'];

  ngOnInit(): void { this.cargar(); }
  cargar(): void {
    this.loading.set(true);
    this.api.getInventario().subscribe({ next: r => { this.inventario.set(r.inventario); this.loading.set(false); }, error: () => this.loading.set(false) });
  }
  guardarNuevo(): void {
    this.api.crearInsumo(this.nuevoForm).subscribe(() => { this.nuevoModal.set(false); this.cargar(); });
  }
  guardarMovimiento(): void {
    const id = this.movimientoItem()!.id_inventario;
    this.api.agregarMovimiento(id, this.movForm).subscribe(() => { this.movimientoItem.set(null); this.cargar(); });
  }
  eliminar(id: number): void { if (!confirm('¿Eliminar este insumo?')) return; this.api.eliminarInsumo(id).subscribe(() => this.cargar()); }
}
