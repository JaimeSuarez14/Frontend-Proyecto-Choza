// gestion-entidades.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientesPanelComponent } from './clientes-panel.component';
import { UsuariosPanelComponent } from './usuarios-panel.component';

@Component({
  selector: 'app-gestion-entidades',
  standalone: true,
  imports: [CommonModule, ClientesPanelComponent, UsuariosPanelComponent],
  template: `
    <div
      class="min-h-screen bg-gray-50 dark:bg-gray-950 p-6 md:p-10 transition-colors duration-300"
    >
      <div
        class="max-w-7xl mx-auto bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800"
      >
        <div
          class="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 p-6 md:px-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <h1
            class="text-3xl font-extrabold text-gray-950 dark:text-gray-50 tracking-tight flex items-center gap-3"
          >
            <span class="text-indigo-600 dark:text-indigo-400">🛡️</span> Panel de Administración
          </h1>

          <div
            class="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 p-1 rounded-full border border-gray-200 dark:border-gray-700"
          >
            <button
              (click)="selectTab('clientes')"
              [ngClass]="{
                'bg-white dark:bg-gray-950 shadow text-indigo-700 dark:text-indigo-300':
                  activeTab === 'clientes',
                'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50':
                  activeTab !== 'clientes',
              }"
              class="px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 ease-out"
            >
              👥 Clientes
            </button>
            <button
              (click)="selectTab('usuarios')"
              [ngClass]="{
                'bg-white dark:bg-gray-950 shadow text-indigo-700 dark:text-indigo-300':
                  activeTab === 'usuarios',
                'text-gray-600 dark:text-gray-400 hover:text-gray-950 dark:hover:text-gray-50':
                  activeTab !== 'usuarios',
              }"
              class="px-6 py-2.5 rounded-full text-sm font-semibold flex items-center gap-2 transition-all duration-300 ease-out"
            >
              👮 Usuarios
            </button>
          </div>
        </div>

        <div class="p-6 md:p-10">
          @if (activeTab === 'clientes') {
            <app-clientes-panel class="fade-in-up"></app-clientes-panel>
          } @else if (activeTab === 'usuarios') {
            <app-usuarios-panel class="fade-in-up"></app-usuarios-panel>
          }
        </div>
      </div>
    </div>
  `,
})
export class GestionPersonas {
  activeTab = 'clientes'; // Pestaña activa por defecto

  selectTab(tab: string) {
    this.activeTab = tab;
  }
}
