import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-cliente-modal',
  standalone: true,
  imports: [ FormsModule],
  template: `
    <div class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" (click)="close.emit()">
      <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 scale-in" (click)="$event.stopPropagation()">

        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ cliente ? '✏️ Editar Cliente' : '👥 Nuevo Cliente' }}
          </h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">✕</button>
        </div>

        <form (ngSubmit)="guardar()" class="p-8 space-y-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Nombre Completo</label>
            <input type="text" [(ngModel)]="form.nombre" name="nombre" required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
              <input type="email" [(ngModel)]="form.email" name="email" required
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Teléfono</label>
              <input type="text" [(ngModel)]="form.telefono" name="telefono"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Dirección</label>
            <input type="text" [(ngModel)]="form.direccion" name="direccion"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Contraseña {{ cliente ? '(dejar en blanco para no cambiar)' : '' }}
            </label>
            <input type="password" [(ngModel)]="form.contrasena" name="contrasena" [required]="!cliente"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>

          <div class="flex gap-3 pt-6">
            <button type="button" (click)="close.emit()"
              class="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="loading"
              class="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 transition-all active:scale-95">
              {{ loading ? '⏳ Guardando...' : '✅ Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class ClienteModalComponent implements OnInit {
  @Input() cliente: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private api = inject(ApiService);
  private toast = inject(ToastService);

  loading = false;
  form = { nombre: '', email: '', telefono: '', direccion: '', contrasena: '' };

  ngOnInit() {
    if (this.cliente) {
      this.form = {
        nombre: this.cliente.nombre,
        email: this.cliente.email,
        telefono: this.cliente.telefono || '',
        direccion: this.cliente.direccion || '',
        contrasena: ''
      };
    }
  }

  guardar() {
    this.loading = true;
    const obs = this.cliente
      ? this.api.actualizarCliente(this.cliente.id_cliente, this.form)
      : this.api.crearCliente(this.form);

    obs.subscribe({
      next: () => {
        this.toast.success(this.cliente ? 'Cliente actualizado' : 'Cliente registrado');
        this.saved.emit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error en la operación');
        this.loading = false;
      }
    });
  }
}
