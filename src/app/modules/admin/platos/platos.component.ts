import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { environment } from '../../../../environments/environment';
import { Plato } from '../../../core/interfaces/plato';

@Component({
  selector: 'app-admin-platos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold dark:text-white">Gestión de Platos</h2>
        <button (click)="nuevoPlato()" class="btn-primary-choza flex items-center gap-2 text-sm">
          <i class="fa-solid fa-plus"></i> Nuevo Plato
        </button>
      </div>

      <!-- Tabla de platos -->
      <div class="card-choza rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          @if (loading()) {
            <div class="p-8 text-center text-gray-400">
              <i class="fa-solid fa-spinner animate-spin text-2xl"></i>
            </div>
          } @else {
            <table class="table-choza">
              <thead>
                <tr>
                  <th>Imagen</th>
                  <th>Nombre</th>
                  <th>Categoría</th>
                  <th>Precio</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                @for (p of platos(); track p.id_plato) {
                  <tr>
                    <td>
                      <img
                        [src]="imgUrl(p.imagen!)"
                        [alt]="p.nombre_plato"
                        (error)="onImgError($event)"
                        class="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td class="font-medium">{{ p.nombre_plato }}</td>
                    <td>
                      <span
                        class="text-xs bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-200 px-2 py-0.5 rounded-full"
                        >{{ p.categoria }}</span
                      >
                    </td>
                    <td class="font-bold">S/. {{ p.precio | number: '1.2-2' }}</td>
                    <td>
                      <div class="flex gap-1">
                        <button
                          (click)="editar(p)"
                          class="w-7 h-7 flex items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <i class="fa-solid fa-pen text-xs"></i>
                        </button>
                        <button
                          (click)="eliminar(p.id_plato)"
                          class="w-7 h-7 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          <i class="fa-solid fa-trash text-xs"></i>
                        </button>
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

    <!-- Modal crear/editar -->
    @if (modalAbierto()) {
      <div
        class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        (click)="modalAbierto.set(false)"
      >
        <div
          class="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl animate-slide-up"
          (click)="$event.stopPropagation()"
        >
          <h3 class="font-bold text-lg dark:text-white mb-4">
            {{ platoEditando() ? 'Editar' : 'Nuevo' }} Plato
          </h3>
          <div class="space-y-3">
            <input
              [(ngModel)]="form.nombre_plato"
              class="input-choza"
              placeholder="Nombre del plato"
            />
            <input [(ngModel)]="form.descripcion" class="input-choza" placeholder="Descripción" />
            <input
              type="number"
              [(ngModel)]="form.precio"
              class="input-choza"
              placeholder="Precio S/."
            />
            <select [(ngModel)]="form.categoria" class="input-choza">
              <option value="">Seleccionar categoría</option>
              @for (c of categorias; track c) {
                <option [value]="c">{{ c }}</option>
              }
            </select>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Imagen</label
              >
              <input
                type="file"
                (change)="onFile($event)"
                accept="image/*"
                class="input-choza text-sm"
              />
            </div>
          </div>
          <div class="flex gap-2 mt-4">
            <button
              (click)="guardar()"
              [disabled]="guardando()"
              class="btn-primary-choza flex-1 flex items-center justify-center gap-1"
            >
              @if (guardando()) {
                <i class="fa-solid fa-spinner animate-spin"></i>
              }
              Guardar
            </button>
            <button (click)="modalAbierto.set(false)" class="btn-secondary-choza flex-1">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    }`,
})
export class AdminPlatosComponent implements OnInit {
  private api = inject(ApiService);
  platos = signal<Plato[]>([]);
  loading = signal(true);
  modalAbierto = signal(false);
  platoEditando = signal<Plato | null>(null);
  guardando = signal(false);
  imagenFile: File | null = null;
  form = { nombre_plato: '', descripcion: '', precio: 0, categoria: '' };
  readonly categorias = [
    'Platos Criollos',
    'Arroces',
    'Ceviches y Especiales',
    'Tiraditos y Leches',
    'Entradas',
    'Cocteles',
    'Bebidas',
  ];

  ngOnInit(): void {
    this.cargar();
  }
  cargar(): void {
    this.loading.set(true);
    this.api.getPlatos().subscribe({
      next: (r) => {
        this.platos.set(r.platos);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
  nuevoPlato(): void {
    this.platoEditando.set(null);
    this.form = { nombre_plato: '', descripcion: '', precio: 0, categoria: '' };
    this.modalAbierto.set(true);
  }
  editar(p: Plato): void {
    this.platoEditando.set(p);
    this.form = {
      nombre_plato: p.nombre_plato!,
      descripcion: p.descripcion!,
      precio: p.precio!,
      categoria: p.categoria!,
    };
    this.modalAbierto.set(true);
  }
  onFile(e: Event): void {
    const f = (e.target as HTMLInputElement).files;
    if (f?.[0]) this.imagenFile = f[0];
  }
  guardar(): void {
    this.guardando.set(true);
    const fd = new FormData();
    Object.entries(this.form).forEach(([k, v]) => fd.append(k, String(v)));
    if (this.imagenFile) fd.append('imagen', this.imagenFile);
    const obs = this.platoEditando()
      ? this.api.actualizarPlato(this.platoEditando()!.id_plato, fd)
      : this.api.crearPlato(fd);
    obs.subscribe({
      next: () => {
        this.modalAbierto.set(false);
        this.guardando.set(false);
        this.cargar();
      },
      error: () => this.guardando.set(false),
    });
  }
  eliminar(id: number): void {
    if (!confirm('¿Eliminar este plato?')) return;
    this.api.eliminarPlato(id).subscribe(() => this.cargar());
  }
  imgUrl(img: string): string {
    console.log(`${environment.apiUrl.replace('/api', '')}/uploads/platos/${img}`);

    return img
      ? `${environment.apiUrl.replace('/api', '')}/uploads/platos/${img}`
      : '/assets/noimage.jpg';
  }
  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = '/assets/noimage.jpg';
  }
}
