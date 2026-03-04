export interface Pedido {
  id_pedido: number;              // int(11), PK
  cliente: Cliente;             // int(11), FK
  fecha_pedido: Date;             // datetime
  pago: Pago;                // int(11), FK
  estado: Estado;              // int(11), FK (puede referirse a una tabla de estados)
  monto_total: number;            // decimal(10,2)
  notas?: string | null;          // text, puede ser NULL
}

export type EstadoNombre = 'Pendiente' | 'En preparacion' | 'Enviado' | 'Entregado' | 'Cancelado';

interface Estado {
  id: number;
  nombre: EstadoNombre;
}

export interface Cliente {
  id_cliente: number;             // int(11), PK
  nombre: string;                 // varchar(100)
  telefono?: string | null;       // varchar(20), puede ser NULL
  direccion?: string | null;      // varchar(100), puede ser NULL
  email?: string | null;          // varchar(100), puede ser NULL
  contrasena: string;             // varchar(200), campo sensible
}

export interface Pago {
  id_pago: number;                // int
  nombre: string;                 // varchar(50)
}
