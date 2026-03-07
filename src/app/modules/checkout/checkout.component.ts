import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CarritoService } from '../../core/services/carrito.service';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-10  min-h-screen">
      <h1 class="text-4xl font-extrabold dark:text-gray-200 text-gray-800 mb-8 flex items-center gap-3">
        <span class="bg-orange-500  p-2 rounded-lg">✅</span> Confirmar Pedido
      </h1>

      <div class="grid md:grid-cols-2 gap-8">
        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <h2 class="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <i class="bi bi-credit-card text-orange-500"></i> Información de Pago
          </h2>

          <div class="space-y-5">
            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Notas del Pedido</label>
              <textarea
                [(ngModel)]="notas"
                rows="3"
                class="w-full p-4 rounded-xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-orange-500 transition-all outline-none text-gray-700"
                placeholder="Ej: Sin cebolla, tocar el timbre..."
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-semibold text-gray-600 mb-2">Elige cómo pagar</label>
              <select
                [(ngModel)]="idPago"
                (change)="onMetodoChange()"
                class="w-full p-4 rounded-xl bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer font-medium"
              >
                <option value="">Seleccionar método...</option>
                @for (m of metodosPago(); track m.id_pago) {
                  <option [value]="m.id_pago">{{ m.nombre }}</option>
                }
              </select>
            </div>
          </div>
        </div>

        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-10">
          <h2 class="text-xl font-bold text-gray-800 mb-6">Tu Carrito</h2>
          <div class="space-y-4 max-h-60 overflow-y-auto pr-2 mb-6">
            @for (item of carrito.items(); track item.id_plato) {
              <div class="flex justify-between items-center text-gray-700">
                <div class="flex flex-col">
                  <span class="font-bold">{{ item.nombre_plato }}</span>
                  <span class="text-xs text-gray-400">Cantidad: {{ item.cantidad }}</span>
                </div>
                <span class="font-semibold text-gray-900"
                  >S/ {{ item.precio * item.cantidad | number: '1.2-2' }}</span
                >
              </div>
            }
          </div>

          <div class="border-t-2 border-dashed border-gray-100 pt-6">
            <div class="flex justify-between items-end">
              <span class="text-gray-500 font-medium">Total a pagar</span>
              <span class="text-3xl font-black text-orange-600 italic"
                >S/ {{ carrito.totalPrecio() | number: '1.2-2' }}</span
              >
            </div>
          </div>
        </div>
      </div>

      @if (showModal()) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        >
          <div
            class="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl transform transition-all scale-in animate-in zoom-in-95"
          >
            <div class="bg-linear-to-r from-orange-500 to-red-600 p-6 text-white text-center">
              <div
                class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
              >
                <span class="text-3xl">🛒</span>
              </div>
              <h3 class="text-2xl font-bold">Resumen de Compra</h3>
            </div>

            <div class="p-8">
              <div class="space-y-4 mb-8">
                <div class="flex justify-between border-b pb-2">
                  <span class="text-gray-500 font-medium">Método seleccionado:</span>
                  <span class="font-bold text-orange-600 uppercase">{{
                    metodoSeleccionado()?.nombre
                  }}</span>
                </div>
                <div class="flex justify-between border-b pb-2">
                  <span class="text-gray-500 font-medium">Productos:</span>
                  <span class="font-bold">{{ carrito.items().length }} items</span>
                </div>
                <div class="p-4 bg-orange-50 rounded-xl flex justify-between items-center">
                  <span class="text-orange-800 font-bold text-lg">Monto Total:</span>
                  <span class="text-2xl font-black text-orange-700"
                    >S/ {{ carrito.totalPrecio() | number: '1.2-2' }}</span
                  >
                </div>
              </div>

              <div class="flex flex-col gap-3">
                <button
                  (click)="confirmar()"
                  [disabled]="procesando()"
                  class="w-full bg-linear-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                >
                  @if (procesando()) {
                    <div
                      class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                    ></div>
                    Verificando...
                  } @else {
                    <i class="bi bi-check-circle-fill"></i> CONFIRMAR Y PAGAR
                  }
                </button>

                <button
                  (click)="showModal.set(false)"
                  class="text-gray-400 font-semibold py-2 hover:text-gray-600 transition-colors"
                >
                  Modificar pedido
                </button>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class CheckoutComponent implements OnInit {
  private api = inject(ApiService);
  carrito = inject(CarritoService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  metodosPago = signal<any[]>([]);
  procesando = signal(false);
  notas = '';
  idPago = '';

  // Signals para el Modal
  showModal = signal(false);
  metodoSeleccionado = signal<any>(null);

  ngOnInit(): void {
    this.api.getMetodosPago().subscribe({
      next: (r) => this.metodosPago.set(r.metodos_pago),
    });
  }

  // Se activa cuando el usuario elige en el <select>
  onMetodoChange() {
    const metodo = this.metodosPago().find((m) => m.id_pago == this.idPago);
    if (metodo) {
      this.metodoSeleccionado.set(metodo);
      this.showModal.set(true); // Abrimos el resumen automáticamente
    }
  }

  confirmar(): void {
    this.showModal.set(false); // Cerramos modal antes de procesar
    this.procesando.set(true);

    const productos = this.carrito.items().map((i) => ({
      id_plato: i.id_plato,
      cantidad: i.cantidad,
    }));

    this.api
      .crearPedido({
        id_cliente: this.auth.user()?.id,
        id_pago: +this.idPago,
        notas: this.notas,
        productos,
      })
      .subscribe({
        next: (r) => {
          this.carrito.vaciar();
          this.toast.success('🎉 Pedido #' + r.id_pedido + ' confirmado');
          this.router.navigate(['/cliente/historial']);
        },
        error: () => {
          this.toast.error('Error al procesar');
          this.procesando.set(false);
        },
      });
  }
}
