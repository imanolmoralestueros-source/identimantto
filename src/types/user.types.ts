export type RolUsuario = 'tecnico' | 'planificador'

export interface Usuario {
  id: string
  nombre: string
  correo: string
  rol: RolUsuario
}

export interface Credenciales {
  correo: string
  password: string
}
