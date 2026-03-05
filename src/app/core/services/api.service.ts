import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // ── Platos ──────────────────────────────────────────────
  getPlatos() {
    return this.http.get<any>(`${this.base}/platos`);
  }
  getCategorias() {
    return this.http.get<any>(`${this.base}/platos/categorias`);
  }
  getPlato(id: number) {
    return this.http.get<any>(`${this.base}/platos/${id}`);
  }
  crearPlato(data: FormData) {
    return this.http.post<any>(`${this.base}/platos`, data);
  }
  actualizarPlato(id: number, data: FormData) {
    return this.http.put<any>(`${this.base}/platos/${id}`, data);
  }
  eliminarPlato(id: number) {
    return this.http.delete<any>(`${this.base}/platos/${id}`);
  }

  // ── Pedidos ─────────────────────────────────────────────
  getPedidos() {
    return this.http.get<any>(`${this.base}/pedidos`);
  }
  getPedido(id: number) {
    return this.http.get<any>(`${this.base}/pedidos/${id}`);
  }
  crearPedido(data: any) {
    return this.http.post<any>(`${this.base}/pedidos`, data);
  }
  cambiarEstado(id: number, estado: number) {
    return this.http.put<any>(`${this.base}/pedidos/${id}/estado`, { nuevo_estado: estado });
  }
  eliminarPedido(id: number) {
    return this.http.delete<any>(`${this.base}/pedidos/${id}`);
  }
  getMetodosPago() {
    return this.http.get<any>(`${this.base}/pedidos/metodos-pago`);
  }
  getHistorialCliente(id: number) {
    return this.http.get<any>(`${this.base}/pedidos/cliente/${id}`);
  }

  // ── Inventario ──────────────────────────────────────────
  getInventario() {
    return this.http.get<any>(`${this.base}/inventario`);
  }
  getInsumo(id: number) {
    return this.http.get<any>(`${this.base}/inventario/${id}`);
  }
  crearInsumo(data: any) {
    return this.http.post<any>(`${this.base}/inventario`, data);
  }
  actualizarInsumo(id: number, data: any) {
    return this.http.put<any>(`${this.base}/inventario/${id}`, data);
  }
  eliminarInsumo(id: number) {
    return this.http.delete<any>(`${this.base}/inventario/${id}`);
  }
  agregarMovimiento(id: number, data: any) {
    return this.http.post<any>(`${this.base}/inventario/${id}/movimiento`, data);
  }
  getMovimientos(id: number) {
    return this.http.get<any>(`${this.base}/inventario/${id}/movimientos`);
  }

  // ── Compras ─────────────────────────────────────────────
  getOrdenes() {
    return this.http.get<any>(`${this.base}/compras/ordenes`);
  }
  getOrden(id: number) {
    return this.http.get<any>(`${this.base}/compras/ordenes/${id}`);
  }
  crearOrden(data: any) {
    return this.http.post<any>(`${this.base}/compras/ordenes`, data);
  }
  aprobarOrden(id: number) {
    return this.http.put<any>(`${this.base}/compras/ordenes/${id}/aprobar`, {});
  }
  recibirOrden(id: number) {
    return this.http.put<any>(`${this.base}/compras/ordenes/${id}/recibir`, {});
  }
  getProveedores() {
    return this.http.get<any>(`${this.base}/compras/proveedores`);
  }
  crearProveedor(data: any) {
    return this.http.post<any>(`${this.base}/compras/proveedores`, data);
  }
  getReporteMensual() {
    return this.http.get<any>(`${this.base}/compras/reporte-mensual`);
  }

  // ── Dashboard ───────────────────────────────────────────
  getEstadisticas() {
    return this.http.get<any>(`${this.base}/dashboard/estadisticas`);
  }
  getHistorialVentas(params?: any) {
    const p = new HttpParams({ fromObject: params || {} });
    return this.http.get<any>(`${this.base}/dashboard/ventas`, { params: p });
  }
  getNotificaciones() {
    return this.http.get<any>(`${this.base}/dashboard/notificaciones`);
  }
  marcarLeido(id: number) {
    return this.http.put<any>(`${this.base}/dashboard/notificaciones/${id}/leer`, {});
  }

  // ── Reseñas ─────────────────────────────────────────────
  getResenas(id_plato: number) {
    return this.http.get<any>(`${this.base}/resenas/plato/${id_plato}`);
  }
  crearResena(data: any) {
    return this.http.post<any>(`${this.base}/resenas`, data);
  }

  getResenasCliente(id_cliente: number) {
    return this.http.get<any>(`${this.base}/resenas/cliente/${id_cliente}`);
  }
}
