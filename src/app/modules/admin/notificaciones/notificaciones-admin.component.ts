import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({ selector: 'app-notificaciones-admin', standalone: true, imports: [CommonModule], template: `
  <div class="p-6 fade-in">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">🔔 Notificaciones</h1>
    <div class="space-y-3 max-w-2xl">
      @for (n of notis(); track n.id_notificacion) {
        <div class="card p-4 flex items-center gap-4 border-l-4 border-amber-400">
          <span class="text-2xl">⚠️</span>
          <div class="flex-1"><p class="font-medium text-gray-800 dark:text-gray-100 text-sm">{{ n.mensaje }}</p><p class="text-xs text-gray-400">{{ n.fecha | date:'dd/MM/yyyy HH:mm' }}</p></div>
          <button (click)="marcarLeido(n.id_notificacion)" class="btn-outline text-xs px-3 py-1">Leído</button>
        </div>
      }
      @if (notis().length === 0) { <div class="card p-12 text-center"><p class="text-4xl mb-2">✅</p><p class="text-gray-500">Sin notificaciones pendientes</p></div> }
    </div>
  </div>`
})
export class NotificacionesAdminComponent implements OnInit {
  private api = inject(ApiService); private toast = inject(ToastService);
  notis = signal<any[]>([]);
  ngOnInit(): void { this.cargar(); }
  cargar(): void { this.api.getNotificaciones().subscribe({ next: r => this.notis.set(r.notificaciones || []) }); }
  marcarLeido(id: number): void { this.api.marcarLeido(id).subscribe({ next: () => { this.toast.success('Marcado'); this.cargar(); } }); }
}
