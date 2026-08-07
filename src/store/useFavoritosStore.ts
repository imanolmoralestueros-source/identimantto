import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritosState {
  favoritos: string[]
  alternar: (id: string) => void
  esFavorito: (id: string) => boolean
  limpiar: () => void
}

const useFavoritosStore = create<FavoritosState>()(
  persist(
    (set, get) => ({
      favoritos: [],

      alternar: (id) => {
        set((state) => ({
          favoritos: state.favoritos.includes(id)
            ? state.favoritos.filter((f) => f !== id)
            : [...state.favoritos, id]
        }))
      },

      esFavorito: (id) => get().favoritos.includes(id),

      limpiar: () => set({ favoritos: [] })
    }),
    { name: 'identimantto-favoritos' }
  )
)

export default useFavoritosStore
