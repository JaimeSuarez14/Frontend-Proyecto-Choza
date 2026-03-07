import { AuthService } from './../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastComponent } from '../../../shared/components/toast.component/toast.component';
import { ToastService } from '../../../core/services/toast.service';

type ReponseUpdate = {
  status: string;
  message: string;
};

@Component({
  selector: 'app-perfil.cliente',
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './perfil.cliente.html',
  styleUrl: './perfil.cliente.css',
})
export default class PerfilCliente {
  // Usamos un Signal para los datos del usuario
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  constructor() {
    this.authService.verPerfil().subscribe({
      next: (e) => {
        this.usuario.set(e.data);
        console.log(e.data);
      },
      error: (e) => console.log(e),
    });
  }
  usuario = signal({
    nombre: 'Juan Pérez',
    telefono: '987 654 321',
    direccion: 'Av. Las Palmeras 123',
    email: 'juan.perez@email.com',
    id: 1,
    tipo: 'cliente',
  });

  modalAbierto = signal(false);
  campoActual = signal<{ key: string; label: string; value: any } | null>(null);

  abrirEditor(key: string, label: string) {
    const currentVal = (this.usuario() as any)[key];
    this.campoActual.set({ key, label, value: currentVal });
    this.modalAbierto.set(true);
  }

  guardarCambios() {
    const editData = this.campoActual();

    if (editData) {
      const { key, value } = editData;

      this.authService.actualizarCampo(this.usuario().id, key, value).subscribe({
        next: (res) => {
          const response = res as ReponseUpdate;

          if (response.status === 'success') {
            // 1. Actualizamos el Signal de forma reactiva
            // Esto hace que la UI se actualice al instante sin recargar la ruta
            this.usuario.update((u) => ({ ...u, [key]: value }));

            // 2. Notificación de éxito
            this.toast.show('¡Datos actualizados correctamente!', 'success');

            // 3. Cerramos el modal
            this.modalAbierto.set(false);

            // Opcional: Si realmente necesitas navegar o resetear la vista
            // this.router.navigate(['/cliente/perfil']);

            console.log('¡Actualizado con éxito!');
          } else {
            this.toast.show('Error: ' + response.message, 'error');
          }
        },
        error: (err) => {
          console.error('Error de conexión', err);
          this.toast.show('Error de red: ' + err.message, 'error');
        },
      });
    }
  }

  cancelarEdicion() {
    this.modalAbierto.set(false);
  }
}
