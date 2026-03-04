import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({ selector: 'app-checkout', standalone: true, imports: [CommonModule, FormsModule], template: `
  <div class="max-w-3xl mx-auto px-4 py-10">
    <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">✅ Confirmar Pedido</h1>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="card p-6">
        <h2 class="font-bold text-gray-800 dark:text-gray-100 mb-4">Datos del pedido</h2>
        <form (ngSubmit)="confirmar()" class="space-y-3">
          <div><label class="form-label">Notas adicionales</label>
          <textarea [(ngModel)]="notas" name="notas" rows="2" class="form-input resize-none" placeholder="Sin picante, extra limón..."></textarea></div>
          <div><label class="form-label">Método de pago</label>
          <select [(ngModel)]="idPago" name="pago" class="form-input" required>
            <option value="">Seleccionar...</option>
            @for (m of metodosPago(); track m.id_pago) { <option [value]="m.id_pago">{{ m.nombre }}</option> }
          </select></div>
          <button type="submit" [disabled]="procesando()" class="btn-ocean w-full py-3 text-base mt-2">
            @if (procesando()) { ⏳ Procesando... } @else { 🎉 Confirmar Pedido }
          </button>
        </form>
      </div>
      <div class="card p-6">
        <h2 class="font-bold text-gray-800 dark:text-gray-100 mb-4">Resumen</h2>
        <div class="space-y-2 text-sm mb-4">
          @for (item of carrito.items(); track item.id_plato) {
            <div class="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{{ item.nombre_plato }} x{{ item.cantidad }}</span>
              <span>S/ {{ (item.precio * item.cantidad) | number:'1.2-2' }}</span>
            </div>
          }
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div class="flex justify-between font-bold text-lg text-gray-800 dark:text-gray-100">
            <span>Total</span>
            <span class="text-cyan-700 dark:text-cyan-400">S/ {{ carrito.totalPrecio() | number:'1.2-2' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>` })
export class CheckoutComponent implements OnInit {
  private api = inject(ApiService); carrito = inject(CarritoService);
  private auth = inject(AuthService); private toast = inject(ToastService); private router = inject(Router);
  metodosPago = signal<any[]>([]); procesando = signal(false); notas = ''; idPago = '';
  ngOnInit(): void { this.api.getMetodosPago().subscribe({ next: r => this.metodosPago.set(r.metodos_pago) }); }
  confirmar(): void {
    if (!this.idPago) { this.toast.warning('Selecciona un método de pago'); return; }
    this.procesando.set(true);
    const productos = this.carrito.items().map(i => ({ id_plato: i.id_plato, cantidad: i.cantidad }));
    this.api.crearPedido({ id_cliente: this.auth.user()?.id, id_pago: +this.idPago, notas: this.notas, productos }).subscribe({
      next: r => { this.carrito.vaciar(); this.toast.success('🎉 Pedido #' + r.id_pedido + ' confirmado'); this.router.navigate(['/cliente/historial']); },
      error: () => { this.toast.error('Error al procesar'); this.procesando.set(false); }
    });
  }
}
