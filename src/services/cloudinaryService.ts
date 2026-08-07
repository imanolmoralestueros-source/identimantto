const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string

interface CloudinaryResponse {
  secure_url: string
  public_id: string
}

export const subirImagen = async (archivo: File): Promise<string> => {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Faltan las variables de Cloudinary en el archivo .env')
  }

  const formData = new FormData()
  formData.append('file', archivo)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: 'POST', body: formData }
    )

    if (!response.ok) {
      throw new Error(`Cloudinary respondió con estado ${response.status}`)
    }

    const data = (await response.json()) as CloudinaryResponse
    return data.secure_url
  } catch (error) {
    console.error('subirImagen', error)
    throw new Error('No se pudo subir la fotografía. Revisa tu conexión e intenta otra vez.')
  }
}
