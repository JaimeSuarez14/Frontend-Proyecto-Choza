import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faStar, faArrowLeft, faPaperPlane, faUtensils } from '@fortawesome/free-solid-svg-icons';
import { ApiService } from '../../../../core/services/api.service';

@Component({
  selector: 'app-calificar-producto',
  standalone: true,
  imports: [CommonModule, FormsModule, FontAwesomeModule, RouterLink],
  templateUrl: './calificar-producto-component.html',
  styles: [
    `
      .star-rating {
        @apply text-4xl cursor-pointer transition-all duration-200 transform hover:scale-125;
      }
      .fade-in-up {
        animation: fadeInUp 0.5s ease-out;
      }
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `,
  ],
})
export default class CalificarProductoComponent implements OnInit {
  // Iconos
  faStar = faStar;
  faArrowLeft = faArrowLeft;
  faPaperPlane = faPaperPlane;
  faUtensils = faUtensils;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private api = inject(ApiService);

  // Estados
  idPedido = 0;
  idPlato = 0;
  nombrePlato = signal('Producto');
  calificacion = signal(0);
  comentario = signal('');
  hoverCalificacion = signal(0);
  enviando = signal(false);

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.idPedido = +params['id_pedido'];
      this.idPlato = +params['id_plato'];
      this.nombrePlato.set(params['nombre'] || 'Producto');
    });
  }

  setCalificacion(valor: number) {
    this.calificacion.set(valor);
  }

  enviarResena() {
    if (this.calificacion() === 0) return alert('Por favor selecciona una calificación');

    this.enviando.set(true);
    const data = {
      id_pedido: this.idPedido,
      id_plato: this.idPlato,
      calificacion: this.calificacion(),
      comentario: this.comentario(),
    };

    this.api.crearResena(data).subscribe({
      next: () => {
        // Redirigir con éxito
        this.router.navigate(['/cliente/detallepedido'], { queryParams: { id: this.idPedido } });
      },
      error: (err) => {
        alert(err.error?.error || 'Error al guardar');
        this.enviando.set(false);
      },
    });
  }
}
