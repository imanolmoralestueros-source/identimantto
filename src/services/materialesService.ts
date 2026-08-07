import type { Material, MaterialNuevo } from '../types/material.types'

const API = import.meta.env.VITE_API_MATERIALES as string

if (!API) {
  console.warn('Falta VITE_API_MATERIALES en el archivo .env')
}

const manejarRespuesta = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`La solicitud falló con estado ${response.status}`)
  }
  return (await response.json()) as T
}

export const obtenerMateriales = async (): Promise<Material[]> => {
  try {
    const response = await fetch(`${API}/materiales`)
    return await manejarRespuesta<Material[]>(response)
  } catch (error) {
    console.error('obtenerMateriales', error)
    throw new Error('No se pudo cargar el catálogo de materiales.')
  }
}

export const obtenerMaterialPorId = async (id: string): Promise<Material> => {
  try {
    const response = await fetch(`${API}/materiales/${id}`)
    return await manejarRespuesta<Material>(response)
  } catch (error) {
    console.error('obtenerMaterialPorId', error)
    throw new Error('No se encontró el material solicitado.')
  }
}

export const crearMaterial = async (material: MaterialNuevo): Promise<Material> => {
  try {
    const response = await fetch(`${API}/materiales`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(material)
    })
    return await manejarRespuesta<Material>(response)
  } catch (error) {
    console.error('crearMaterial', error)
    throw new Error('No se pudo registrar el material.')
  }
}

export const actualizarImagenMaterial = async (
  id: string,
  imagenUrl: string
): Promise<Material> => {
  try {
    const response = await fetch(`${API}/materiales/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagenUrl })
    })
    return await manejarRespuesta<Material>(response)
  } catch (error) {
    console.error('actualizarImagenMaterial', error)
    throw new Error('No se pudo actualizar la fotografía del material.')
  }
}
