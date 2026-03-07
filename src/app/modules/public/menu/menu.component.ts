import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="text-center mb-8 fade-in">
        <h1 class="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">🍽️ Nuestro Menú</h1>
        <p class="text-gray-500 dark:text-gray-400">
          Selecciona tus platos favoritos y agrégalos al carrito
        </p>
      </div>

      <!-- Filtros de categoría -->
      <div class="flex gap-2 flex-wrap justify-center mb-8 fade-in">
        <button
          (click)="categoriaActiva.set('')"

          [class]="'px-4 py-2 rounded-full text-sm font-medium border transition-all dark:bg-gray-800 dark:border-gray-600 hover:border-cyan-400 ' + (categoriaActiva() === '' ? 'bg-cyan-700 text-white dark:text-cyan-700 dark:bg-white': ' dark:text-white  ') "
        >
          🌟 Todos
        </button>
        @for (cat of categorias(); track cat) {
          <button
            (click)="categoriaActiva.set(cat)"
            [class]="'px-4 py-2 rounded-full text-sm font-medium border transition-all dark:bg-gray-800 dark:border-gray-600 hover:border-cyan-400 ' + (categoriaActiva() === cat ? 'bg-cyan-700 text-white dark:text-cyan-700 dark:bg-white': 'dark:text-white ') "
          >
            {{ cat }}
          </button>
        }
      </div>

      <!-- Búsqueda -->
      <div class="max-w-md mx-auto mb-8">
        <div class="relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            [(ngModel)]="busqueda"
            placeholder="Buscar plato..."
            class="form-input pl-10 rounded-full"
          />
        </div>
      </div>

      <!-- Grid de platos -->
      @if (cargando()) {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          @for (_ of [1, 2, 3, 4, 5, 6, 7, 8]; track $index) {
            <div class="card animate-pulse h-80"></div>
          }
        </div>
      } @else if(categoriasConPlatos().length > 0) {
        @for (cat of categoriasConPlatos(); track cat.nombre) {
          <div class="mb-10 fade-in">
            <div class="flex items-center gap-3 mb-5">
              <span class="bg-cyan-700 text-white text-sm px-4 py-1.5 rounded-full font-semibold">
                {{ cat.nombre }}
              </span>
              <div class="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
              <span class="text-sm text-gray-400">{{ cat.platos.length }} platos</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              @for (p of cat.platos; track p.id_plato) {
                <div class="card-hover overflow-hidden group">
                  <div class="relative overflow-hidden h-44">
                    <img
                      [src]="imgUrl(p.imagen)"
                      [alt]="p.nombre_plato"
                      class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      (error)="onImgError($event)"
                    />
                    <div
                      class="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    ></div>
                  </div>
                  <div class="p-4">
                    <h3
                      class="font-semibold text-gray-800 dark:text-gray-100 text-sm mb-1 line-clamp-1"
                    >
                      {{ p.nombre_plato }}
                    </h3>
                    <p class="text-xs text-gray-400 line-clamp-2 mb-3 min-h-8">
                      {{ p.descripcion }}
                    </p>
                    <div class="flex items-center justify-between">
                      <span class="text-base font-bold text-cyan-700 dark:text-cyan-400"
                        >S/ {{ p.precio | number: '1.2-2' }}</span
                      >
                      <div class="flex items-center gap-1">
                        <div
                          class="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden"
                        >
                          <button
                            (click)="decQty(p.id_plato)"
                            class="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold dark:text-gray-200"
                          >
                            −
                          </button>
                          <span class="w-7 text-center text-xs font-medium  dark:text-gray-200">{{
                            getCantidad(p.id_plato)
                          }}</span>
                          <button
                            (click)="incQty(p.id_plato)"
                            class="w-7 h-7 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold  dark:text-gray-200"
                          >
                            +
                          </button>
                        </div>
                        <button
                          (click)="agregar(p)"
                          class="btn-ocean text-xs px-3 py-1.5 rounded-lg"
                        >
                          🛒
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      } @else {
         <div class="card animate-pulse h-80 leading-5 text-center">No hay resultados en tu busqueda</div>
      }
    </div>

    <!-- Floating cart button -->
    @if (carrito.totalItems() > 0) {
      <div class="fixed bottom-6 right-6 z-40">
        <a
          routerLink="/carrito"
          class="flex items-center gap-3 bg-cyan-700 hover:bg-cyan-800 text-white px-5 py-3 rounded-2xl shadow-xl transition-all hover:scale-105"
        >
          🛒
          <span class="font-semibold">{{ carrito.totalItems() }} items</span>
          <span class="font-bold text-yellow-300"
            >S/ {{ carrito.totalPrecio() | number: '1.2-2' }}</span
          >
        </a>
      </div>
    }
  `,
})
export class MenuComponent implements OnInit {
  private api = inject(ApiService);
  carrito = inject(CarritoService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);

  platos = signal<any[]>([]);
  categorias = signal<string[]>([]);
  cargando = signal(true);
  categoriaActiva = signal('');
  busqueda = signal('');
  cantidades: Record<number, number> = {};

  platosFiltrados = computed(() => {
    let lista = this.platos();
    if (this.categoriaActiva()) lista = lista.filter((p) => p.categoria === this.categoriaActiva());
    if (this.busqueda().trim())
      lista = lista.filter((p) =>
        p.nombre_plato.toLowerCase().includes(this.busqueda().toLowerCase()),
      );
    return lista;
  });

  categoriasConPlatos = computed(() => {
    const lista = this.platosFiltrados();
    const cats = [...new Set(lista.map((p: any) => p.categoria))];
    return cats.map((nombre) => ({
      nombre,
      platos: lista.filter((p: any) => p.categoria === nombre),
    }));
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['categoria']) this.categoriaActiva.set(params['categoria']);
    });
    this.api.getPlatos().subscribe({
      next: (res) => {
        console.log(res);
        this.platos.set(res.platos);
        this.categorias.set([...new Set(res.platos.map((p: any) => p.categoria))] as string[]);
        res.platos.forEach((p: any) => (this.cantidades[p.id_plato] = 1));
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  agregar(p: any): void {
    const qty = this.cantidades[p.id_plato] || 1;
    this.carrito.agregar(
      { id_plato: p.id_plato, nombre_plato: p.nombre_plato, precio: p.precio, imagen: p.imagen },
      qty,
    );
    this.toast.success(`${p.nombre_plato} agregado al carrito`);
  }

  getCantidad(id: number): number {
    return this.cantidades[id] || 1;
  }
  incQty(id: number): void {
    this.cantidades[id] = (this.cantidades[id] || 1) + 1;
  }
  decQty(id: number): void {
    if ((this.cantidades[id] || 1) > 1) this.cantidades[id]--;
  }

  imgUrl(img: string): string {
    return img ? `http://localhost:8080/uploads/platos/${img}` : '/assets/noimage.jpg';
  }
  onImgError(e: Event): void {
    (e.target as HTMLImageElement).src = '/assets/noimage.jpg';
  }
}
