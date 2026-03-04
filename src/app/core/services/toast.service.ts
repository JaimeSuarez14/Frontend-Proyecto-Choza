import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: number;
  tipo: 'success' | 'error' | 'warning' | 'info';
  mensaje: string;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  readonly toasts = signal<Toast[]>([]);
  private nextId = 0;

  show(mensaje: string, tipo: Toast['tipo'] = 'info', duracion = 3500): void {
    const id = ++this.nextId;
    this.toasts.update((t) => [...t, { id, tipo, mensaje }]);
    setTimeout(() => this.remove(id), duracion);
  }

  success(msg: string) {
    this.show(msg, 'success');
  }
  error(msg: string) {
    this.show(msg, 'error', 5000);
  }
  warning(msg: string) {
    this.show(msg, 'warning');
  }
  info(msg: string) {
    this.show(msg, 'info');
  }

  remove(id: number): void {
    this.toasts.update((t) => t.filter((x) => x.id !== id));
  }
}
