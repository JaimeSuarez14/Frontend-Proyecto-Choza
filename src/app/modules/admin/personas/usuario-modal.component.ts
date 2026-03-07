import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-usuario-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all" (click)="close.emit()">
      <div class="bg-white dark:bg-gray-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 scale-in" (click)="$event.stopPropagation()">

        <div class="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/50">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ usuario ? '✏️ Editar Usuario' : '👤 Nuevo Usuario' }}
          </h2>
          <button (click)="close.emit()" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-2xl">✕</button>
        </div>

        <form (ngSubmit)="guardar()" class="p-8 space-y-5">
          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Nombre Completo</label>
            <input type="text" [(ngModel)]="form.nombre" name="nombre" required
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Usuario (Login)</label>
              <input type="text" [(ngModel)]="form.usuario" name="usuario" required
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
            </div>
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rol</label>
              <select [(ngModel)]="form.rol" name="rol"
                class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario Estándar</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Contraseña {{ usuario ? '(dejar en blanco para no cambiar)' : '' }}
            </label>
            <input type="password" [(ngModel)]="form.contrasena" name="contrasena" [required]="!usuario"
              class="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-950 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all">
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" (click)="close.emit()"
              class="flex-1 px-6 py-3.5 rounded-xl font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" [disabled]="loading"
              class="flex-1 px-6 py-3.5 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none disabled:opacity-50 transition-all active:scale-95">
              {{ loading ? '⏳ Guardando...' : '✅ Guardar Cambios' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class UsuarioModalComponent implements OnInit {
  @Input() usuario: any = null;
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private api = inject(ApiService);
  private toast = inject(ToastService);

  loading = false;
  form = { nombre: '', rol: 'usuario', usuario: '', contrasena: '' };

  ngOnInit() {
    if (this.usuario) {
      // Cargamos datos si es edición
      this.form.nombre = this.usuario.nombre;
      this.form.rol = this.usuario.rol;
      this.form.usuario = this.usuario.usuario;
      this.form.contrasena = ''; // No mostramos el hash
    }
  }

  guardar() {
    if (!this.form.nombre || !this.form.usuario) {
        this.toast.error('Nombre y Usuario son requeridos');
        return;
    }

    this.loading = true;
    const obs = this.usuario
      ? this.api.actualizarUsuario(this.usuario.id_usuario, this.form)
      : this.api.crearUsuario(this.form);

    obs.subscribe({
      next: () => {
        this.toast.success(this.usuario ? 'Usuario actualizado' : 'Usuario creado');
        this.saved.emit();
      },
      error: (err) => {
        this.toast.error(err.error?.message || 'Error al procesar');
        this.loading = false;
      }
    });
  }
}
