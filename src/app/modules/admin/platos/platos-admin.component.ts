import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-platos-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 fade-in">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">🍽️ Gestión de Platos</h1>
          <p class="text-gray-500 dark:text-gray-400 text-sm">{{ platos().length }} platos en la carta</p>
        </div>
        <button (click)="abrirModal()" class="btn-ocean flex items-center gap-2">
          ➕ Nuevo Plato
        </button>
      </div>

      <!-- Grid platos -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        @for (p of platos(); track p.id_plato) {
          <div class="card overflow-hidden group">
            <div class="relative h-40 overflow-hidden">
              <img [src]="imgUrl(p.imagen)" [alt]="p.nombre_plato"
                   class="w-full h-full object-cover group-hover:scale-105 transition-transform"
                   (error)="onImgError($event)">
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button (click)="editar(p)" class="w-9 h-9 rounded-lg bg-white text-cyan-700 flex items-center justify-center hover:bg-cyan-50">✏️</button>
                <button (click)="eliminar(p.id_plato)" class="w-9 h-9 rounded-lg bg-white text-red-600 flex items-center justify-center hover:bg-red-50">🗑️</button>
              </div>
            </div>
            <div class="p-3">
              <p class="font-semibold text-sm text-gray-800 dark:text-gray-100 truncate">{{ p.nombre_plato }}</p>
              <p class="text-xs text-gray-400 truncate mb-1">{{ p.categoria }}</p>
              <p class="font-bold text-cyan-700 dark:text-cyan-400 text-sm">S/ {{ p.precio | number:'1.2-2' }}</p>
            </div>
          </div>
        }
      </div>
    </div>

    <!-- Modal -->
    @if (modalAbierto()) {
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
           (click)="cerrarModal()">
        <div class="card w-full max-w-lg p-6" (click)="$event.stopPropagation()">
          <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 mb-5">
            {{ editando() ? '✏️ Editar Plato' : '➕ Nuevo Plato' }}
          </h2>
          <form (ngSubmit)="guardar()" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="col-span-2">
                <label class="form-label">Nombre del plato</label>
                <input type="text" [(ngModel)]="form.nombre_plato" name="nombre_plato" class="form-input" required>
              </div>
              <div>
                <label class="form-label">Precio (S/)</label>
                <input type="number" step="0.5" [(ngModel)]="form.precio" name="precio" class="form-input" required>
              </div>
              <div>
                <label class="form-label">Categoría</label>
                <select [(ngModel)]="form.categoria" name="categoria" class="form-input">
                  <option value="">Seleccionar...</option>
                  @for (c of categorias; track c) { <option [value]="c">{{ c }}</option> }
                </select>
              </div>
              <div class="col-span-2">
                <label class="form-label">Descripción</label>
                <textarea [(ngModel)]="form.descripcion" name="descripcion" rows="2" class="form-input resize-none"></textarea>
              </div>
              <div class="col-span-2">
                <label class="form-label">Imagen</label>
                <input type="file" accept="image/*" (change)="onFile($event)" class="form-input text-sm">
              </div>
            </div>
            <div class="flex gap-3 pt-2">
              <button type="button" (click)="cerrarModal()" class="btn-outline flex-1">Cancelar</button>
              <button type="submit" [disabled]="guardando()" class="btn-ocean flex-1">
                @if (guardando()) { ⏳ Guardando... } @else { ✅ Guardar }
              </button>
            </div>
          </form>
        </div>
      </div>
    }
  `
})
export class PlatosAdminComponent implements OnInit {
  private api   = inject(ApiService);
  private toast = inject(ToastService);

  platos       = signal<any[]>([]);
  modalAbierto = signal(false);
  editando     = signal<any>(null);
  guardando    = signal(false);
  archivoSeleccionado: File | null = null;

  form = { nombre_plato:'', descripcion:'', precio:0, categoria:'' };
  categorias = ['Ceviches y Especiales','Arroces','Platos Criollos','Tiraditos y Leches','Entradas','Bebidas','Cocteles'];

  ngOnInit(): void { this.cargar(); }

  cargar(): void {
    this.api.getPlatos().subscribe({ next: r => this.platos.set(r.platos) });
  }

  abrirModal(): void {
    this.editando.set(null);
    this.form = { nombre_plato:'', descripcion:'', precio:0, categoria:'' };
    this.modalAbierto.set(true);
  }

  editar(p: any): void {
    this.editando.set(p);
    this.form = { nombre_plato: p.nombre_plato, descripcion: p.descripcion, precio: p.precio, categoria: p.categoria };
    this.modalAbierto.set(true);
  }

  cerrarModal(): void { this.modalAbierto.set(false); this.editando.set(null); }

  onFile(e: Event): void {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (f) this.archivoSeleccionado = f;
  }

  guardar(): void {
    this.guardando.set(true);
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.archivoSeleccionado) fd.append('imagen', this.archivoSeleccionado);

    const obs = this.editando()
      ? this.api.actualizarPlato(this.editando().id_plato, fd)
      : this.api.crearPlato(fd);

    obs.subscribe({
      next: () => {
        this.toast.success(this.editando() ? 'Plato actualizado' : 'Plato creado');
        this.cerrarModal(); this.cargar(); this.guardando.set(false);
      },
      error: () => { this.toast.error('Error al guardar'); this.guardando.set(false); }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este plato?')) return;
    this.api.eliminarPlato(id).subscribe({
      next: () => { this.toast.success('Plato eliminado'); this.cargar(); },
      error: () => this.toast.error('Error al eliminar')
    });
  }

  imgUrl(img: string): string { return img ? `http://localhost/choza-api/uploads/platos/${img}` : '/assets/img/noimage.jpg'; }
  onImgError(e: Event): void { (e.target as HTMLImageElement).src = '/assets/img/noimage.jpg'; }
}
