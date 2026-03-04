import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-10">
      <div class="w-full max-w-md">
        <div class="card p-8 fade-in">
          <div class="text-center mb-6">
            <div class="w-16 h-16 rounded-full bg-cyan-700 flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg">👤</div>
            <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100">Crear Cuenta</h1>
            <p class="text-gray-500 dark:text-gray-400 text-sm">Regístrate para hacer pedidos</p>
          </div>

          @if (error()) {
            <div class="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm mb-4">❌ {{ error() }}</div>
          }

          <form (ngSubmit)="registrar()" class="space-y-4">
            <div>
              <label class="form-label">Nombre completo</label>
              <input type="text" [(ngModel)]="form.nombre" name="nombre" class="form-input" placeholder="Tu nombre" required>
            </div>
            <div>
              <label class="form-label">Correo electrónico</label>
              <input type="email" [(ngModel)]="form.email" name="email" class="form-input" placeholder="tu@email.com" required>
            </div>
            <div>
              <label class="form-label">Teléfono</label>
              <input type="tel" [(ngModel)]="form.telefono" name="telefono" class="form-input" placeholder="987654321">
            </div>
            <div>
              <label class="form-label">Dirección</label>
              <input type="text" [(ngModel)]="form.direccion" name="direccion" class="form-input" placeholder="Av. Principal 123">
            </div>
            <div>
              <label class="form-label">Contraseña</label>
              <input type="password" [(ngModel)]="form.contrasena" name="contrasena" class="form-input" placeholder="Mínimo 6 caracteres" required>
            </div>
            <button type="submit" [disabled]="cargando()" class="btn-ocean w-full py-3 text-base">
              @if (cargando()) { ⏳ Registrando... } @else { ✅ Crear cuenta }
            </button>
          </form>

          <p class="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
            ¿Ya tienes cuenta? <a routerLink="/auth/login" class="text-cyan-700 font-medium hover:underline">Iniciar sesión</a>
          </p>
        </div>
      </div>
    </div>
  `
})
export class RegistroComponent {
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);

  cargando = signal(false);
  error = signal('');
  form = { nombre: '', email: '', telefono: '', direccion: '', contrasena: '' };

  registrar(): void {
    this.cargando.set(true); this.error.set('');
    this.auth.registro(this.form).subscribe({
      next: () => { this.toast.success('¡Cuenta creada! Bienvenido'); this.router.navigate(['/']); },
      error: (e) => { this.error.set(e.error?.error || 'Error al registrar'); this.cargando.set(false); }
    });
  }
}
