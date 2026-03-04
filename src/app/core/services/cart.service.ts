import { computed, Injectable, signal } from '@angular/core';

export interface CartItem {
  id_plato: number;
  nombre_plato: string;
  precio: number;
  cantidad: number;
  imagen: string;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Señal reactiva del carrito
  private _items = signal<CartItem[]>(this.loadCart());

  // Señales públicas derivadas
  readonly items = this._items.asReadonly();
  readonly totalItems = computed(() => this._items().reduce((s, i) => s + i.cantidad, 0));
  readonly totalPrice = computed(() =>
    this._items().reduce((s, i) => s + i.precio * i.cantidad, 0),
  );
  readonly isEmpty = computed(() => this._items().length === 0);

  agregar(plato: Omit<CartItem, 'cantidad'>, cantidad = 1): void {
    this._items.update((items) => {
      const idx = items.findIndex((i) => i.id_plato === plato.id_plato);
      if (idx >= 0) {
        const updated = [...items];
        updated[idx] = { ...updated[idx], cantidad: updated[idx].cantidad + cantidad };
        return updated;
      }
      return [...items, { ...plato, cantidad }];
    });
    this.saveCart();
  }

  setCantidad(id_plato: number, cantidad: number): void {
    if (cantidad <= 0) {
      this.quitar(id_plato);
      return;
    }

    this._items.update((items) =>
      items.map((i) => (i.id_plato === id_plato ? { ...i, cantidad } : i)),
    );
    this.saveCart();
  }

  quitar(id_plato: number): void {
    this._items.update((items) => items.filter((i) => i.id_plato !== id_plato));
    this.saveCart();
  }

  vaciar(): void {
    this._items.set([]);
    localStorage.removeItem('choza_cart');
  }

  private saveCart(): void {
    localStorage.setItem('choza_cart', JSON.stringify(this._items()));
  }

  private loadCart(): CartItem[] {
    try {
      const raw = localStorage.getItem('choza_cart');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
