import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../../../core/services/api.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faCreditCard , faUtensils, faStarHalfStroke} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-detalle-pedido',
  standalone: true,
  imports: [CommonModule, RouterLink, FontAwesomeModule],
  templateUrl: `./detalle-pedido-component.html`,
  styleUrl: `./detalle-pedido-component.css`,
})
export default class DetallePedidoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  faArrowLeft = faArrowLeft;
  faCreditCard = faCreditCard;
  faUtensils = faUtensils;
  faStarHalfStroke = faStarHalfStroke;

  pedido = signal<any>(null);
  cargando = signal(true);

  ngOnInit(): void {
    // Obtenemos el ID desde los queryParams (?id=X)
    this.route.queryParams.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.cargarDetalle(id);
      } else {
        this.cargando.set(false);
      }
    });
  }

  cargarDetalle(id: number) {
    this.api.getPedido(id).subscribe({
      next: (r) => {
        // Según tu backend: $this->ok(['pedido' => $pedido]);
        this.pedido.set(r.pedido);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.cargando.set(false);
      }
    });
  }

  imgUrl(img: string): string {
    return img ? `http://localhost:8080/uploads/platos/${img}` : '/assets/noimage.jpg';
  }
}
