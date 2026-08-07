import { useRef, useState } from 'react'
import { Alert, AlertIcon, Button, HStack, Text, VStack } from '@chakra-ui/react'
import { FaCamera } from 'react-icons/fa'
import { subirImagen } from '../../../services/cloudinaryService'
import { actualizarImagenMaterial } from '../../../services/materialesService'

interface SubirFotoProps {
  materialId: string
  onSubida: (url: string) => void
}

const SubirFoto = ({ materialId, onSubida }: SubirFotoProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [subiendo, setSubiendo] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)

  const manejarArchivo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const archivo = e.target.files?.[0]
    if (!archivo) return

    setSubiendo(true)
    setError(null)
    setExito(false)

    try {
      const url = await subirImagen(archivo)
      await actualizarImagenMaterial(materialId, url)
      onSubida(url)
      setExito(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo subir la fotografía.')
    } finally {
      setSubiendo(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <VStack align="stretch" gap="0.75rem">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={manejarArchivo}
      />

      <HStack>
        <Button
          leftIcon={<FaCamera />}
          colorScheme="orange"
          size="sm"
          isLoading={subiendo}
          loadingText="Subiendo"
          onClick={() => inputRef.current?.click()}
        >
          Cargar fotografía
        </Button>
        <Text fontSize="xs" color="gray.500">JPG o PNG</Text>
      </HStack>

      {error && (
        <Alert status="error" borderRadius="md" fontSize="sm">
          <AlertIcon />{error}
        </Alert>
      )}

      {exito && (
        <Alert status="success" borderRadius="md" fontSize="sm">
          <AlertIcon />Fotografía cargada.
        </Alert>
      )}
    </VStack>
  )
}

export default SubirFoto
