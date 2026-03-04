import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-historial',
  standalone: true,
  imports: [CommonModule],
  template: ` <div class="max-w-4xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6">📋 Mis Pedidos</h1>
    @if (cargando()) {
      <div class="card p-8 text-center text-gray-400 animate-pulse">Cargando...</div>
    } @else if (pedidos().length === 0) {
      <div class="card p-12 text-center">
        <p class="text-5xl mb-3">📦</p>
        <p class="text-gray-500">No tienes pedidos aún</p>
      </div>
    } @else {
      <div class="space-y-4">
        @for (p of pedidos(); track p.id_pedido) {
          <div class="card p-4 fade-in flex items-center justify-between">
            <div>
              <p class="font-bold text-cyan-700 dark:text-cyan-400">#{{ p.id_pedido }}</p>
              <p class="text-xs text-gray-400">{{ p.fecha_pedido | date: 'dd/MM/yyyy HH:mm' }}</p>
              <p class="text-xs text-gray-500">{{ p.metodo_pago }}</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-gray-800 dark:text-gray-100">
                S/ {{ p.monto_total | number: '1.2-2' }}
              </p>
              <span class="estado-badge bg-amber-100 text-amber-800 text-xs">{{ p.estado }}</span>
            </div>
          </div>
        }
      </div>
    }
  </div>`,
})
export class HistorialComponent implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  pedidos = signal<any[]>([]);
  cargando = signal(true);
  ngOnInit(): void {
    const id = this.auth.user()?.id;
    if (id)
      this.api.getHistorialCliente(id).subscribe({
        next: (r) => {
          console.log(r);

          this.pedidos.set(r.pedidos || []);
          this.cargando.set(false);
        },
        error: (err) => {
          console.error(err);
          this.cargando.set(false);
        },
      });
    else this.cargando.set(false);
  }
}
