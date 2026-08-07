export type EstadoMaterial = 'activo' | 'inactivo'

export interface Material {
  id: string
  codigoNisira: string
  descripcionNisira: string
  nombreComun: string
  palabrasClave: string[]
  grupo: string
  subgrupo: string
  equipoRelacionado: string
  unidadMedida: string
  marca?: string
  modelo?: string
  ubicacion?: string
  imagenUrl: string | null
  estado: EstadoMaterial
  observaciones?: string
}

export type MaterialNuevo = Omit<Material, 'id'>

export interface ResumenInventario {
  total: number
  sinFotografia: number
  activos: number
  grupos: number
}
