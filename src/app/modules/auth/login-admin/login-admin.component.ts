import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div class="w-full max-w-md">
        <div class="card-choza rounded-2xl p-8 shadow-lg">
          <div class="text-center mb-6">
            <div
              class="w-14 h-14 bg-green-700 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <i class="fa-solid fa-user-shield text-white text-xl"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 dark:text-white">Panel Administrador</h2>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Acceso restringido al staff</p>
          </div>

          @if (error()) {
            <div
              class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800
                      text-red-700 dark:text-red-400 rounded-lg px-4 py-3 mb-4 text-sm flex items-center gap-2"
            >
              <i class="fa-solid fa-circle-exclamation"></i> {{ error() }}
            </div>
          }

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Usuario</label
              >
              <input
                [(ngModel)]="usuario"
                class="input-choza"
                placeholder="admin"
                (keyup.enter)="submit()"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >Contraseña</label
              >
              <input
                type="password"
                [(ngModel)]="password"
                class="input-choza"
                placeholder="••••••"
                (keyup.enter)="submit()"
              />
            </div>
            <button
              (click)="submit()"
              [disabled]="loading()"
              class="btn-primary-choza w-full py-3 flex items-center justify-center gap-2"
            >
              @if (loading()) {
                <i class="fa-solid fa-spinner animate-spin"></i> Verificando...
              } @else {
                <i class="fa-solid fa-lock"></i> Acceder al Panel
              }
            </button>
          </div>
          <p class="text-center text-xs text-gray-400 mt-4">
            <a routerLink="/auth/login" class="hover:underline">← Acceso de clientes</a>
          </p>
        </div>
      </div>
    </div>
  `,
})
export class LoginAdminComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  usuario = '';
  password = '';
  error = signal('');
  loading = signal(false);

  submit(): void {
    if (!this.usuario || !this.password) {
      this.error.set('Completa todos los campos');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.auth.loginAdmin(this.usuario, this.password).subscribe({
      next: () => this.router.navigate(['/admin']),
      error: (err) => {
        this.error.set(err.error?.error ?? 'Credenciales incorrectas');
        this.loading.set(false);
      },
    });
  }
}
