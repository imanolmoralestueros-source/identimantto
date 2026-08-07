import { useCallback, useEffect, useState } from 'react'
import {
  Badge, Box, Button, Card, CardBody, Divider, Grid, GridItem, Heading,
  HStack, Image, Modal, ModalBody, ModalCloseButton, ModalContent,
  ModalHeader, ModalOverlay, Tag, Text, useDisclosure, VStack
} from '@chakra-ui/react'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { FaQrcode, FaArrowLeft, FaImage, FaStar, FaRegStar } from 'react-icons/fa'
import { obtenerMaterialPorId } from '../../services/materialesService'
import type { Material } from '../../types/material.types'
import useAuthStore from '../../store/useAuthStore'
import useFavoritosStore from '../../store/useFavoritosStore'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import SubirFoto from './components/SubirFoto'
import { Paths } from '../../router/routes'

interface FilaProps {
  etiqueta: string
  valor?: string | null
}

const Fila = ({ etiqueta, valor }: FilaProps) => (
  <HStack justify="space-between" align="start" py="0.5rem" borderBottomWidth="1px" borderColor="gray.100">
    <Text fontSize="sm" color="gray.500" minW="150px">{etiqueta}</Text>
    <Text fontSize="sm" textAlign="right" fontWeight="medium">{valor || '—'}</Text>
  </HStack>
)

const MaterialDetalle = () => {
  const { id } = useParams<{ id: string }>()
  const puedeEditar = useAuthStore((state) => state.puedeEditar)
  const favoritos = useFavoritosStore((state) => state.favoritos)
  const alternar = useFavoritosStore((state) => state.alternar)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [material, setMaterial] = useState<Material | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    if (!id) return
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerMaterialPorId(id)
      setMaterial(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido.')
    } finally {
      setCargando(false)
    }
  }, [id])

  useEffect(() => {
    cargar()
  }, [cargar])

  if (cargando) return <Cargando mensaje="Cargando ficha del material…" />
  if (error) return <MensajeError detalle={error} onReintentar={cargar} />
  if (!material) return null

  const esFavorito = favoritos.includes(material.id)
  const urlFicha = `${window.location.origin}${Paths.materialDetalle(material.id)}`

  return (
    <VStack align="stretch" gap="1.5rem">
      <HStack justify="space-between" wrap="wrap" gap="1rem">
        <Button as={RouterLink} to={Paths.materiales} leftIcon={<FaArrowLeft />} variant="ghost" size="sm">
          Volver al catálogo
        </Button>

        <HStack>
          <Button
            leftIcon={esFavorito ? <FaStar /> : <FaRegStar />}
            size="sm"
            variant="outline"
            colorScheme={esFavorito ? 'yellow' : 'gray'}
            onClick={() => alternar(material.id)}
          >
            {esFavorito ? 'En favoritos' : 'Agregar a favoritos'}
          </Button>
          <Button leftIcon={<FaQrcode />} size="sm" colorScheme="marca" onClick={onOpen}>
            Ver QR
          </Button>
        </HStack>
      </HStack>

      <Grid templateColumns={{ base: '1fr', md: '380px 1fr' }} gap="1.5rem">
        <GridItem>
          <Card>
            <Box bg="arena.100" h="340px">
              {material.imagenUrl ? (
                <Image src={material.imagenUrl} alt={material.nombreComun} objectFit="cover" w="100%" h="100%" />
              ) : (
                <VStack justify="center" h="100%" color="gray.400" gap="0.5rem">
                  <FaImage size={36} />
                  <Text fontSize="sm">Sin fotografía registrada</Text>
                </VStack>
              )}
            </Box>

            {puedeEditar() && (
              <CardBody>
                <SubirFoto
                  materialId={material.id}
                  onSubida={(url) => setMaterial({ ...material, imagenUrl: url })}
                />
              </CardBody>
            )}
          </Card>
        </GridItem>

        <GridItem>
          <Card>
            <CardBody>
              <VStack align="stretch" gap="1rem">
                <Box>
                  <HStack gap="0.5rem" mb="0.35rem">
                    <Tag colorScheme="marca" size="sm">{material.grupo}</Tag>
                    <Badge colorScheme={material.estado === 'activo' ? 'green' : 'red'}>
                      {material.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </HStack>
                  <Heading size="lg">{material.nombreComun}</Heading>
                  <Text fontFamily="mono" color="marca.700" fontSize="lg" mt="0.25rem">
                    {material.codigoNisira}
                  </Text>
                </Box>

                <Divider />

                <Box>
                  <Fila etiqueta="Descripción Nisira" valor={material.descripcionNisira} />
                  <Fila etiqueta="Equipo relacionado" valor={material.equipoRelacionado} />
                  <Fila etiqueta="Subgrupo" valor={material.subgrupo} />
                  <Fila etiqueta="Unidad de medida" valor={material.unidadMedida} />
                  <Fila etiqueta="Marca" valor={material.marca} />
                  <Fila etiqueta="Modelo" valor={material.modelo} />
                  <Fila etiqueta="Ubicación" valor={material.ubicacion} />
                  <Fila etiqueta="Observaciones" valor={material.observaciones} />
                </Box>

                <Box>
                  <Text fontSize="sm" color="gray.500" mb="0.5rem">Palabras clave</Text>
                  <HStack gap="0.4rem" wrap="wrap">
                    {material.palabrasClave.map((p) => (
                      <Tag key={p} size="sm" variant="subtle" colorScheme="gray">{p}</Tag>
                    ))}
                  </HStack>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{material.nombreComun}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb="2rem">
            <VStack gap="1rem">
              <Box bg="white" p="1rem" borderWidth="1px" borderColor="gray.200" borderRadius="md">
                <QRCodeSVG value={urlFicha} size={220} level="M" />
              </Box>
              <Text fontSize="sm" color="gray.600" textAlign="center">
                Imprime este código y pégalo en el estante. Al escanearlo se abre esta ficha.
              </Text>
              <Text fontSize="xs" color="gray.400" fontFamily="mono" textAlign="center">
                {material.codigoNisira}
              </Text>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </VStack>
  )
}

export default MaterialDetalle
