export interface Plato {
  id_plato: number;              // int(11), PK, AUTO_INCREMENT
  nombre_plato?: string ;  // varchar(100), puede ser NULL
  descripcion?: string ;   // varchar(200), puede ser NULL
  precio?: number ;        // decimal(10,2), puede ser NULL
  categoria?: string ;     // varchar(50), puede ser NULL
  imagen?: string ;        // varchar(200), puede ser NULL
}
