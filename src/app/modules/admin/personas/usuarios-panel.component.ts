import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { UsuarioModalComponent } from './usuario-modal.component';

@Component({
  selector: 'app-usuarios-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, UsuarioModalComponent],
  template: `
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="relative grow max-w-xl">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600"
            >🔍</span
          >
          <input
            type="search"
            [(ngModel)]="searchTerm"
            (input)="search()"
            placeholder="Buscar por nombre o usuario..."
            class="w-full pl-12 pr-6 py-3.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-700 text-gray-950 dark:text-gray-50 transition-colors outline-none"
          />
        </div>
        <button
          (click)="abrirModalCrear()"
          class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition-all active:scale-95"
        >
          ➕ Nuevo Usuario
        </button>
      </div>

      <div
        class="overflow-x-auto bg-gray-50 dark:bg-gray-950/40 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
      >
        <table class="w-full min-w-175">
          <thead
            class="bg-gray-100/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700"
          >
            <tr>
              <th
                class="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
              >
                Nombre Completo
              </th>
              <th
                class="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
              >
                Usuario / Login
              </th>
              <th
                class="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
              >
                Rol
              </th>
              <th
                class="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
              >
                Acciones
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            @for (u of usuarios(); track u.id_usuario) {
              <tr class="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors group">
                <td class="px-6 py-5 font-semibold text-gray-950 dark:text-gray-50">
                  {{ u.nombre }}
                </td>
                <td class="px-6 py-5 text-gray-600 dark:text-gray-400 font-mono text-sm">
                  {{ u.usuario }}
                </td>
                <td class="px-6 py-5">
                  <span
                    [ngClass]="
                      u.rol === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300'
                        : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                    "
                    class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  >
                    {{ u.rol }}
                  </span>
                </td>
                <td class="px-6 py-5 text-right">
                  <div
                    class="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <button
                      (click)="abrirModalEditar(u)"
                      class="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      (click)="eliminarUsuario(u.id_usuario)"
                      class="p-2 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="4" class="px-6 py-12 text-center">
                  <div class="text-gray-400 dark:text-gray-600 mb-2 text-4xl">👥</div>
                  <p class="text-gray-500 dark:text-gray-400">
                    No se encontraron usuarios registrados.
                  </p>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      @if (modalVisible()) {
        <app-usuario-modal
          [usuario]="usuarioEnEdicion()"
          (close)="cerrarModal()"
          (saved)="onSaved()"
        >
        </app-usuario-modal>
      }
    </div>
  `,
})
export class UsuariosPanelComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  usuarios = signal<any[]>([]);
  searchTerm = '';
  modalVisible = signal(false);
  usuarioEnEdicion = signal<any | null>(null);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.api.getUsuarios(this.searchTerm).subscribe({
      next: (res: any) => this.usuarios.set(res.usuarios),
      error: () => this.toast.error('Error al conectar con el servidor'),
    });
  }

  search() {
    this.cargar(); // Implementado con debounce opcional en el pipe o aquí
  }

  abrirModalCrear() {
    this.usuarioEnEdicion.set(null);
    this.modalVisible.set(true);
  }

  abrirModalEditar(u: any) {
    this.usuarioEnEdicion.set(u);
    this.modalVisible.set(true);
  }

  cerrarModal() {
    this.modalVisible.set(false);
  }

  onSaved() {
    this.cerrarModal();
    this.cargar();
  }

  eliminarUsuario(id: number) {
    if (confirm('¿Deseas eliminar permanentemente a este usuario?')) {
      this.api.eliminarUsuario(id).subscribe({
        next: () => {
          this.toast.success('Usuario eliminado');
          this.cargar();
        },
        error: () => this.toast.error('No se pudo eliminar el usuario'),
      });
    }
  }
}
