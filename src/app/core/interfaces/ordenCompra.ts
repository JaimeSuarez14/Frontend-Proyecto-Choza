import { Proveedor } from "./proveedor";

export interface OrdenCompra {
  id_orden: number;                // int(11), PK
  proveedor: Proveedor;            // int(11), FK
  fecha_orden: Date;               // datetime
  estado: 'pendiente' | 'aprobada' | 'recibida' | 'cancelada'; // enum
  monto_total: number;             // decimal(10,2)
}
