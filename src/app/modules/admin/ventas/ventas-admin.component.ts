import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-ventas-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: ` <div class="p-6 fade-in">
    <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">📈 Historial de Ventas</h1>
    <div class="card p-4 mb-5 flex flex-wrap gap-3">
      <input type="date" [(ngModel)]="fechaDesde" class="form-input w-40 text-sm" />
      <input type="date" [(ngModel)]="fechaHasta" class="form-input w-40 text-sm" />
      <button (click)="cargar()" class="btn-ocean text-sm px-4">Filtrar</button>
      <button (click)="generarPDF()" class="btn-ocean text-sm px-4">Descargar PDF</button>
    </div>
    <div class="card overflow-hidden">
      <table class="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Cliente</th>
            <th>Fecha</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Pago</th>
          </tr>
        </thead>
        <tbody>
          @for (v of ventas(); track v.id_pedido) {
            <tr>
              <td class="font-mono text-cyan-700 font-bold">#{{ v.id_pedido }}</td>
              <td>
                <p class="font-medium">{{ v.nombre }}</p>
                <p class="text-xs text-gray-400">{{ v.email }}</p>
              </td>
              <td class="text-xs">{{ v.fecha_pedido | date: 'dd/MM/yyyy HH:mm' }}</td>
              <td class="font-bold text-cyan-700">S/ {{ v.monto_total | number: '1.2-2' }}</td>
              <td>
                <span class="estado-badge bg-green-100 text-green-700 text-xs">{{ v.estado }}</span>
              </td>
              <td class="text-xs">{{ v.metodo_pago }}</td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  </div>`,
})
export class VentasAdminComponent implements OnInit {
  private api = inject(ApiService);
  ventas = signal<any[]>([]);
  fechaDesde = '';
  fechaHasta = '';
  ngOnInit(): void {
    this.cargar();
  }
  cargar(): void {
    this.api
      .getHistorialVentas({ fecha_desde: this.fechaDesde, fecha_hasta: this.fechaHasta })
      .subscribe({ next: (r) => this.ventas.set(r.ventas || []) });
  }

  generarPDF() {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Reporte de Ventas', 14, 20);

    doc.setFontSize(11);
    doc.text(`Fecha desde: ${this.fechaDesde || 'Todas'}`, 14, 30);
    doc.text(`Fecha hasta: ${this.fechaHasta || 'Todas'}`, 14, 36);

    const ventas = this.ventas();

    const rows = ventas.map((v) => [
      v.id_pedido,
      v.nombre,
      new Date(v.fecha_pedido).toLocaleString(),
      `S/ ${v.monto_total}`,
      v.estado,
      v.metodo_pago,
    ]);

    autoTable(doc, {
      startY: 45,
      head: [['#', 'Cliente', 'Fecha', 'Monto', 'Estado', 'Pago']],
      body: rows,
    });

    doc.save('reporte-ventas.pdf');
  }
}
