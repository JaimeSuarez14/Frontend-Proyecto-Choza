import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4">
      <div class="w-full max-w-md">

        <!-- Card -->
        <div class="card p-8 fade-in">
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-full bg-cyan-700 flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">🐟</div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Iniciar Sesión</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Ingresa a tu cuenta de La Choza</p>
          </div>

          <!-- Tabs cliente/admin -->
          <div class="flex bg-gray-100 dark:bg-gray-700 rounded-xl p-1 mb-6">
            <button (click)="modo.set('cliente')" class="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              [class.bg-white]="modo()==='cliente'" [class.dark:bg-gray-600]="modo()==='cliente'"
              [class.shadow]="modo()==='cliente'" [class.text-cyan-700]="modo()==='cliente'">
              👤 Cliente
            </button>
            <button (click)="modo.set('admin')" class="flex-1 py-2 text-sm font-medium rounded-lg transition-all"
              [class.bg-white]="modo()==='admin'" [class.dark:bg-gray-600]="modo()==='admin'"
              [class.shadow]="modo()==='admin'" [class.text-cyan-700]="modo()==='admin'">
              🛡️ Admin
            </button>
          </div>

          <!-- Error -->
          @if (error()) {
            <div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg p-3 text-sm mb-4">
              ❌ {{ error() }}
            </div>
          }

          <!-- Form cliente -->
          @if (modo() === 'cliente') {
            <form (ngSubmit)="loginCliente()" class="space-y-4">
              <div>
                <label class="form-label">Correo electrónico</label>
                <input type="email" [(ngModel)]="email" name="email" class="form-input" placeholder="tu@email.com" required>
              </div>
              <div>
                <label class="form-label">Contraseña</label>
                <input type="password" [(ngModel)]="password" name="password" class="form-input" placeholder="••••••••" required>
              </div>
              <button type="submit" [disabled]="cargando()" class="btn-ocean w-full py-3 text-base">
                @if (cargando()) { ⏳ Ingresando... } @else { Iniciar Sesión }
              </button>
            </form>
          } @else {
            <form (ngSubmit)="loginAdmin()" class="space-y-4">
              <div>
                <label class="form-label">Usuario</label>
                <input type="text" [(ngModel)]="usuario" name="usuario" class="form-input" placeholder="admin" required>
              </div>
              <div>
                <label class="form-label">Contraseña</label>
                <input type="password" [(ngModel)]="password" name="password" class="form-input" placeholder="••••••••" required>
              </div>
              <button type="submit" [disabled]="cargando()" class="btn-ocean w-full py-3 text-base">
                @if (cargando()) { ⏳ Ingresando... } @else { Acceder al Panel }
              </button>
            </form>
          }

          @if (modo() === 'cliente') {
            <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
              ¿No tienes cuenta?
              <a routerLink="/auth/registro" class="text-cyan-700 dark:text-cyan-400 font-medium hover:underline">Regístrate aquí</a>
            </p>
          }
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  private auth   = inject(AuthService);
  private toast  = inject(ToastService);
  private router = inject(Router);

  modo     = signal<'cliente'|'admin'>('cliente');
  cargando = signal(false);
  error    = signal('');
  email = ''; password = ''; usuario = '';

  loginCliente(): void {
    this.cargando.set(true); this.error.set('');
    this.auth.loginCliente(this.email, this.password).subscribe({
      next: () => { this.toast.success('¡Bienvenido!'); this.router.navigate(['/']); },
      error: (e) => { this.error.set(e.error?.error || 'Credenciales incorrectas'); this.cargando.set(false); }
    });
  }

  loginAdmin(): void {
    this.cargando.set(true); this.error.set('');
    this.auth.loginAdmin(this.usuario, this.password).subscribe({
      next: () => { this.toast.success('¡Bienvenido al panel!'); this.router.navigate(['/admin']); },
      error: (e) => { this.error.set(e.error?.error || 'Credenciales incorrectas'); this.cargando.set(false); }
    });
  }
}
