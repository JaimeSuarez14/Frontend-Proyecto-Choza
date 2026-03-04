import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CarritoService } from '../../core/services/carrito.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="max-w-4xl mx-auto px-4 py-10">
      <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">🛒 Tu Carrito</h1>
      <p class="text-gray-500 dark:text-gray-400 text-sm mb-8">{{ carrito.totalItems() }} producto(s) seleccionado(s)</p>

      @if (carrito.estaVacio()) {
        <div class="card p-16 text-center fade-in">
          <div class="text-6xl mb-4">🛒</div>
          <h2 class="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">Tu carrito está vacío</h2>
          <p class="text-gray-400 mb-6">Agrega platos desde nuestro menú</p>
          <a routerLink="/menu" class="btn-ocean px-6 py-3 inline-block">Ver Menú</a>
        </div>
      } @else {
        <div class="grid lg:grid-cols-3 gap-6">

          <!-- Items -->
          <div class="lg:col-span-2 space-y-4">
            @for (item of carrito.items(); track item.id_plato) {
              <div class="card p-4 flex items-center gap-4 fade-in">
                <img [src]="imgUrl(item.imagen)" [alt]="item.nombre_plato"
                     class="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                     (error)="onImgError($event)">
                <div class="flex-1 min-w-0">
                  <h3 class="font-semibold text-gray-800 dark:text-gray-100 truncate">{{ item.nombre_plato }}</h3>
                  <p class="text-cyan-700 dark:text-cyan-400 font-bold">S/ {{ item.precio | number:'1.2-2' }}</p>
                </div>
                <div class="flex items-center gap-2 flex-shrink-0">
                  <div class="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                    <button (click)="carrito.actualizar(item.id_plato, item.cantidad - 1)"
                      class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-gray-600 dark:text-gray-300">−</button>
                    <span class="w-10 text-center text-sm font-medium text-gray-800 dark:text-gray-200">{{ item.cantidad }}</span>
                    <button (click)="carrito.actualizar(item.id_plato, item.cantidad + 1)"
                      class="w-8 h-8 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 font-bold text-gray-600 dark:text-gray-300">+</button>
                  </div>
                  <span class="text-sm font-bold text-gray-700 dark:text-gray-200 w-20 text-right">
                    S/ {{ (item.precio * item.cantidad) | number:'1.2-2' }}
                  </span>
                  <button (click)="eliminar(item)"
                    class="w-8 h-8 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    🗑️
                  </button>
                </div>
              </div>
            }

            <button (click)="carrito.vaciar()" class="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 mt-2">
              🗑️ Vaciar carrito
            </button>
          </div>

          <!-- Resumen -->
          <div>
            <div class="card p-6 sticky top-24">
              <h3 class="font-bold text-lg text-gray-800 dark:text-gray-100 mb-4">Resumen</h3>
              <div class="space-y-2 text-sm mb-4">
                @for (item of carrito.items(); track item.id_plato) {
                  <div class="flex justify-between text-gray-600 dark:text-gray-400">
                    <span class="truncate max-w-32">{{ item.nombre_plato }} x{{ item.cantidad }}</span>
                    <span>S/ {{ (item.precio * item.cantidad) | number:'1.2-2' }}</span>
                  </div>
                }
              </div>
              <div class="border-t border-gray-200 dark:border-gray-700 pt-3 mb-5">
                <div class="flex justify-between font-bold text-gray-800 dark:text-gray-100 text-lg">
                  <span>Total</span>
                  <span class="text-cyan-700 dark:text-cyan-400">S/ {{ carrito.totalPrecio() | number:'1.2-2' }}</span>
                </div>
              </div>
              <a routerLink="/checkout" class="btn-ocean w-full py-3 block text-center text-base rounded-xl">
                ✅ Proceder al pago
              </a>
              <a routerLink="/menu" class="btn-outline w-full py-2.5 block text-center text-sm rounded-xl mt-2">
                ← Seguir comprando
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CarritoComponent {
  carrito = inject(CarritoService);
  private toast = inject(ToastService);

  eliminar(item: any): void {
    this.carrito.eliminar(item.id_plato);
    this.toast.info(`${item.nombre_plato} eliminado`);
  }

  imgUrl(img: string): string { return img ? `http://localhost/choza-api/uploads/platos/${img}` : '/assets/img/noimage.jpg'; }
  onImgError(e: Event): void { (e.target as HTMLImageElement).src = '/assets/img/noimage.jpg'; }
}
