export interface Inventario {
  id_inventario: number;          // int(11), PK
  nombre_insumo: string;          // varchar(100)
  stock_actual: number;           // decimal(10,2)
  stock_minimo: number;           // decimal(10,2)
  unidad: string;                 // varchar(20)
  estado: number;                 // tinyint(4), puede representar estados (ej. activo/inactivo)
  fecha_actualizacion: Date;      // timestamp
  bajo_stock: boolean;            // tinyint(1), representado como boolean
}
