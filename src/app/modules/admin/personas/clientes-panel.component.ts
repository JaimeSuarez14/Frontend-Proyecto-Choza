// clientes-panel.component.ts
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service'; // Asume que tienes este servicio
import { ToastService } from '../../../core/services/toast.service'; // Asume que tienes este servicio
import { ClienteModalComponent } from './cliente-modal.component'; // Componente de modal separado

@Component({
  selector: 'app-clientes-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ClienteModalComponent],
  template: `
    <div class="space-y-8">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div class="relative grow max-w-xl">
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600">🔍</span>
          <input
            type="search"
            [(ngModel)]="searchTerm"
            (keyup)="search()"
            placeholder="Buscar por nombre o email..."
            class="w-full pl-12 pr-6 py-3.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-800 focus:border-indigo-400 dark:focus:border-indigo-700 text-gray-950 dark:text-gray-50 transition-colors">
        </div>
        <button
          (click)="abrirModalCrear()"
          class="inline-flex items-center gap-2.5 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-md shadow-indigo-200 dark:shadow-none transition-colors">
          ➕ Nuevo Cliente
        </button>
      </div>

      <div class="overflow-x-auto bg-gray-50 dark:bg-gray-950/40 rounded-3xl border border-gray-100 dark:border-gray-800">|
        <table class="w-full min-w-175">
          <thead class="bg-gray-100/70 dark:bg-gray-800/60 border-b border-gray-200 dark:border-gray-700">
            <tr>
              <th class="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Nombre</th>
              <th class="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Email</th>
              <th class="px-6 py-5 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Teléfono</th>
              <th class="px-6 py-5 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Acciones</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
            <tr *ngFor="let c of clientes()" class="hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 transition-colors">
              <td class="px-6 py-5">
                <div class="font-semibold text-gray-950 dark:text-gray-50">{{ c.nombre }}</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">{{ c.direccion }}</div>
              </td>
              <td class="px-6 py-5 text-gray-700 dark:text-gray-300">{{ c.email }}</td>
              <td class="px-6 py-5 text-gray-700 dark:text-gray-300">{{ c.telefono }}</td>
              <td class="px-6 py-5 text-right">
                <div class="flex items-center justify-end gap-2.5">
                  <button (click)="abrirModalEditar(c)" class="p-2.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors">✏️</button>
                  <button (click)="eliminarCliente(c.id_cliente)" class="p-2.5 rounded-lg bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800 transition-colors">🗑️</button>
                </div>
              </td>
            </tr>
            <tr *ngIf="clientes().length === 0">
              <td colspan="4" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                No se encontraron clientes que coincidan con la búsqueda.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <app-cliente-modal *ngIf="modalVisible()" [cliente]="clienteEnEdicion()" (close)="cerrarModal()" (saved)="cargarClientes()"></app-cliente-modal>
    </div>
  `
})
export class ClientesPanelComponent implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);

  clientes = signal<any[]>([]);
  searchTerm = '';
  modalVisible = signal(false);
  clienteEnEdicion = signal<any | null>(null);

  ngOnInit() {
    this.cargarClientes();
  }

  cargarClientes() {
    this.api.getClientes(this.searchTerm).subscribe({
      next: (response: any) => this.clientes.set(response.clientes),
      error: () => this.toast.error('Error al cargar clientes')
    });
  }

  search() {
    this.cargarClientes();
  }

  abrirModalCrear() {
    this.clienteEnEdicion.set(null);
    this.modalVisible.set(true);
  }

  abrirModalEditar(cliente: any) {
    this.clienteEnEdicion.set(cliente);
    this.modalVisible.set(true);
  }

  cerrarModal() {
    this.modalVisible.set(false);
    this.clienteEnEdicion.set(null);
  }

  eliminarCliente(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      this.api.eliminarCliente(id).subscribe({
        next: () => {
          this.toast.success('Cliente eliminado correctamente');
          this.cargarClientes();
        },
        error: () => this.toast.error('Error al eliminar cliente')
      });
    }
  }
}
