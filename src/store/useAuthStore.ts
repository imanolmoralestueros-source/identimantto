import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Credenciales, Usuario } from '../types/user.types'

const USUARIOS: Array<Usuario & { password: string }> = [
  {
    id: '1',
    nombre: 'Técnico de Mantenimiento',
    correo: 'tecnico@mantenimiento.com',
    password: 'tecnico123',
    rol: 'tecnico'
  },
  {
    id: '2',
    nombre: 'Planificador de Mantenimiento',
    correo: 'planificador@mantenimiento.com',
    password: 'plan123',
    rol: 'planificador'
  }
]

interface AuthState {
  usuario: Usuario | null
  iniciarSesion: (credenciales: Credenciales) => Usuario
  cerrarSesion: () => void
  puedeEditar: () => boolean
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      usuario: null,

      iniciarSesion: ({ correo, password }) => {
        const encontrado = USUARIOS.find(
          (u) => u.correo === correo.trim().toLowerCase() && u.password === password
        )

        if (!encontrado) {
          throw new Error('Correo o contraseña incorrectos.')
        }

        const { password: _omitido, ...usuario } = encontrado
        void _omitido
        set({ usuario })
        return usuario
      },

      cerrarSesion: () => set({ usuario: null }),

      puedeEditar: () => get().usuario?.rol === 'planificador'
    }),
    { name: 'identimantto-auth' }
  )
)

export default useAuthStore
