export interface Proveedor {
  id_proveedor: number;          // int(11), PK
  nombre: string;                // varchar(100)
  ruc: string;                   // varchar(20)
  telefono?: string | null;      // varchar(20), puede ser NULL
  correo?: string | null;        // varchar(100), puede ser NULL
  direccion?: string | null;     // varchar(150), puede ser NULL
  estado: boolean;               // tinyint(1), representado como boolean
  fecha_registro: Date;          // timestamp
}
