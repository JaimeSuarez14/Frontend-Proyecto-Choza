import { Component, inject, signal, OnInit } from '@angular/core';
import { ApiService } from '../../../core/services/api.service';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resenas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-6xl mx-auto px-4 py-10">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center gap-2">
          <span class="text-yellow-500">⭐</span> Mis Reseñas
        </h1>
        <span class="px-4 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
          {{ resenas().length }} Total
        </span>
      </div>

      @if (cargando()) {
        <div
          class="flex flex-col items-center justify-center p-20 bg-white dark:bg-gray-800 rounded-2xl shadow-sm"
        >
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p class="mt-4 text-gray-500">Cargando tus experiencias...</p>
        </div>
      } @else {
        <div
          class="bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700"
        >
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr
                  class="bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 uppercase text-xs font-semibold"
                >
                  <th class="px-6 py-4">Plato</th>
                  <th class="px-6 py-4 text-center">Calificación</th>
                  <th class="px-6 py-4">Comentario</th>
                  <th class="px-6 py-4">Categoría</th>
                  <th class="px-6 py-4 text-right">Precio</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                @for (item of resenas(); track item.id_resena) {
                  <tr class="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td class="px-6 py-4 font-semibold text-gray-800 dark:text-gray-200">
                      {{ item.nombre_plato }}
                    </td>
                    <td class="px-6 py-4">
                      <div class="flex items-center justify-end gap-2">
                        <div class="flex gap-1">
                          @for (star of [].constructor(item.calificacion); track $index) {
                            ⭐
                          }

                          @for (star of [].constructor(5 - item.calificacion); track $index) {
                            <i class="fa-regular fa-star text-gray-300"></i>
                          }
                        </div>

                        <span class="text-xs text-gray-500 font-semibold">
                          {{ item.calificacion }}/5
                        </span>
                      </div>
                    </td>
                    <td
                      class="px-6 py-4 text-gray-600 dark:text-gray-400 italic text-sm max-w-xs truncate"
                    >
                      "{{ item.comentario }}"
                    </td>
                    <td class="px-6 py-4">
                      <span
                        class="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-500"
                      >
                        {{ item.categoria }}
                      </span>
                    </td>
                    <td
                      class="px-6 py-4 text-right font-mono font-bold text-green-600 dark:text-green-400"
                    >
                      {{ item.precio | currency: 'USD' }}
                    </td>
                  </tr>
                } @empty {
                  <tr>
                    <td colspan="5" class="px-6 py-12 text-center text-gray-400">
                      <i class="fa-solid fa-comment-slash text-4xl mb-4 block"></i>
                      Aún no has escrito ninguna reseña.
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      }
    </div>
  `,
})
export class ResenasComponent implements OnInit {
  resenasService = inject(ApiService);
  auth = inject(AuthService);

  resenas = signal<any[]>([]);
  cargando = signal(true);

  ngOnInit() {
    this.obtenerResenas();
  }

  obtenerResenas() {
    const id = this.auth.user()?.id;
    if (!id) {
      this.cargando.set(false);
      return;
    }

    this.resenasService.getResenasCliente(id).subscribe({
      next: (r) => {
        console.log(r);

        // --- REVISIÓN AQUÍ ---
        // Si en consola ves [ {id:1...}, {...} ], entonces usa: this.resenas.set(r);
        // Si ves { resenas: [...], total: 10 }, entonces usa: this.resenas.set(r.resenas);
        const data = Array.isArray(r) ? r : r.resenas || [];
        this.resenas.set(data);
        this.cargando.set(false);
        console.log(this.resenas());
      },
      error: (err) => {
        console.error('Error cargando reseñas:', err);
        this.cargando.set(false);
      },
    });
  }
}
