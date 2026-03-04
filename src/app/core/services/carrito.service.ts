import { computed, Injectable, signal } from '@angular/core';

export interface ItemCarrito {
  id_plato: number;
  nombre_plato: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  // Señal con los items del carrito (persistido en localStorage)
  readonly items = signal<ItemCarrito[]>(this.cargarCarrito());

  // Señales computadas
  readonly totalItems = computed(() => this.items().reduce((s, i) => s + i.cantidad, 0));
  readonly totalPrecio = computed(() =>
    this.items().reduce((s, i) => s + i.precio * i.cantidad, 0),
  );
  readonly estaVacio = computed(() => this.items().length === 0);

  agregar(plato: Omit<ItemCarrito, 'cantidad'>, cantidad = 1): void {
    this.items.update((items) => {
      const idx = items.findIndex((i) => i.id_plato === plato.id_plato);
      if (idx >= 0) {
        const copia = [...items];
        copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + cantidad };
        return copia;
      }
      return [...items, { ...plato, cantidad }];
    });
    this.persistir();
  }

  actualizar(id_plato: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.eliminar(id_plato);
      return;
    }

    this.items.update((items) =>
      items.map((i) => (i.id_plato === id_plato ? { ...i, cantidad } : i)),
    );
    this.persistir();
  }

  eliminar(id_plato: number): void {
    this.items.update((items) => items.filter((i) => i.id_plato !== id_plato));
    this.persistir();
  }

  vaciar(): void {
    this.items.set([]);
    localStorage.removeItem('choza-carrito');
  }

  private persistir(): void {
    localStorage.setItem('choza-carrito', JSON.stringify(this.items()));
  }

  private cargarCarrito(): ItemCarrito[] {
    try {
      const raw = localStorage.getItem('choza-carrito');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
