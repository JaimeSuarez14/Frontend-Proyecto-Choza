import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-inventario-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 fade-in">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">🏪 Inventario</h1>
          <p class="text-sm text-gray-500">{{ bajosStock().length }} insumos con stock bajo</p>
        </div>
        <button (click)="abrirModal('crear')" class="btn-ocean flex items-center gap-2">➕ Nuevo Insumo</button>
      </div>

      @if (bajosStock().length > 0) {
        <div class="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl p-4 mb-5 flex items-center gap-3">
          <span class="text-2xl">⚠️</span>
          <div>
            <p class="font-semibold text-amber-800 dark:text-amber-300 text-sm">Stock bajo en {{ bajosStock().length }} insumo(s)</p>
            <p class="text-xs text-amber-600 dark:text-amber-400">{{ bajosStock().map(i=>i.nombre_insumo).join(', ') }}</p>
          </div>
        </div>
      }

      <div class="card overflow-hidden">
        <table class="admin-table">
          <thead><tr>
            <th>Insumo</th><th>Stock Actual</th><th>Stock Mínimo</th><th>Unidad</th><th>Estado</th><th>Acciones</th>
          </tr></thead>
          <tbody>
            @for (item of inventario(); track item.id_inventario) {
              <tr>
                <td class="font-medium">{{ item.nombre_insumo }}</td>
                <td [class.text-red-600]="item.bajo_stock" [class.font-bold]="item.bajo_stock">{{ item.stock_actual }}</td>
                <td class="text-gray-400">{{ item.stock_minimo }}</td>
                <td class="text-xs text-gray-500">{{ item.unidad }}</td>
                <td>
                  <span class="estado-badge" [class.bg-green-100]="!item.bajo_stock" [class.text-green-700]="!item.bajo_stock"
                    [class.bg-red-100]="item.bajo_stock" [class.text-red-700]="item.bajo_stock">
                    {{ item.bajo_stock ? '⚠️ Reponer' : '✅ OK' }}
                  </span>
                </td>
                <td>
                  <div class="flex gap-1">
                    <button (click)="abrirModal('movimiento', item)" class="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-900/30 text-cyan-700 flex items-center justify-center text-sm">📥</button>
                    <button (click)="abrirModal('editar', item)" class="w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex items-center justify-center text-sm">✏️</button>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal -->
    @if (modal()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" (click)="modal.set(null)">
        <div class="card w-full max-w-md p-6" (click)="$event.stopPropagation()">
          <h2 class="font-bold text-xl text-gray-800 dark:text-gray-100 mb-4">
            {{ modal() === 'crear' ? '➕ Nuevo Insumo' : modal() === 'editar' ? '✏️ Editar Insumo' : '📥 Registrar Movimiento' }}
          </h2>

          @if (modal() === 'movimiento') {
            <form (ngSubmit)="guardarMovimiento()" class="space-y-3">
              <p class="text-sm font-medium text-cyan-700 mb-3">{{ seleccionado()?.nombre_insumo }}</p>
              <div>
                <label class="form-label">Tipo</label>
                <select [(ngModel)]="movForm.tipo" name="tipo" class="form-input">
                  <option value="entrada">📥 Entrada</option>
                  <option value="salida">📤 Salida</option>
                  <option value="ajuste">🔧 Ajuste</option>
                </select>
              </div>
              <div><label class="form-label">Cantidad</label><input type="number" step="0.01" [(ngModel)]="movForm.cantidad" name="cantidad" class="form-input" required></div>
              <div><label class="form-label">Motivo</label><input type="text" [(ngModel)]="movForm.motivo" name="motivo" class="form-input"></div>
              <div class="flex gap-3"><button type="button" (click)="modal.set(null)" class="btn-outline flex-1">Cancelar</button><button type="submit" class="btn-ocean flex-1">Registrar</button></div>
            </form>
          } @else {
            <form (ngSubmit)="guardarInsumo()" class="space-y-3">
              <div><label class="form-label">Nombre del insumo</label><input type="text" [(ngModel)]="insumoForm.nombre_insumo" name="nombre" class="form-input" required></div>
              <div class="grid grid-cols-2 gap-3">
                <div><label class="form-label">Stock actual</label><input type="number" step="0.01" [(ngModel)]="insumoForm.stock_actual" name="stock" class="form-input"></div>
                <div><label class="form-label">Stock mínimo</label><input type="number" step="0.01" [(ngModel)]="insumoForm.stock_minimo" name="minimo" class="form-input"></div>
              </div>
              <div><label class="form-label">Unidad</label>
                <select [(ngModel)]="insumoForm.unidad" name="unidad" class="form-input">
                  <option value="kg">kg</option><option value="litros">litros</option><option value="unidad">unidad</option>
                </select>
              </div>
              <div class="flex gap-3"><button type="button" (click)="modal.set(null)" class="btn-outline flex-1">Cancelar</button><button type="submit" class="btn-ocean flex-1">Guardar</button></div>
            </form>
          }
        </div>
      </div>
    }
  `
})
export class InventarioAdminComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  inventario   = signal<any[]>([]);
  modal        = signal<string|null>(null);
  seleccionado = signal<any>(null);

  bajosStock = computed(() => this.inventario().filter(i => i.bajo_stock));

  movForm    = { tipo:'entrada', cantidad:0, motivo:'compra' };
  insumoForm = { nombre_insumo:'', stock_actual:0, stock_minimo:0, unidad:'kg' };

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.api.getInventario().subscribe({ next: r => this.inventario.set(r.inventario) });
  }

  abrirModal(tipo: string, item?: any): void {
    this.seleccionado.set(item || null);
    if (tipo === 'editar' && item) this.insumoForm = { nombre_insumo: item.nombre_insumo, stock_actual: item.stock_actual, stock_minimo: item.stock_minimo, unidad: item.unidad };
    else this.insumoForm = { nombre_insumo:'', stock_actual:0, stock_minimo:0, unidad:'kg' };
    this.movForm = { tipo:'entrada', cantidad:0, motivo:'compra' };
    this.modal.set(tipo);
  }

  guardarMovimiento(): void {
    const id = this.seleccionado().id_inventario;
    this.api.agregarMovimiento(id, this.movForm).subscribe({
      next: () => { this.toast.success('Movimiento registrado'); this.modal.set(null); this.cargar(); },
      error: () => this.toast.error('Error al registrar')
    });
  }

  guardarInsumo(): void {
    const obs = this.seleccionado()
      ? this.api.actualizarInsumo(this.seleccionado().id_inventario, this.insumoForm)
      : this.api.crearInsumo(this.insumoForm);
    obs.subscribe({
      next: () => { this.toast.success('Guardado'); this.modal.set(null); this.cargar(); },
      error: () => this.toast.error('Error')
    });
  }
}
