import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css',
})
export class ToastComponent {
   toast = inject(ToastService);
  clases(tipo: string): string {
    const m: any = { success:'bg-green-50 border-green-200 text-green-800', error:'bg-red-50 border-red-200 text-red-800', warning:'bg-amber-50 border-amber-200 text-amber-800', info:'bg-blue-50 border-blue-200 text-blue-800' };
    return m[tipo] || m['info'];
  }
  icono(tipo: string): string {
    return ({ success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' } as any)[tipo] || 'ℹ️';
  }
}
