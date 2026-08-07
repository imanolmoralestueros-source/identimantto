import { Badge, Box, Card, CardBody, HStack, Heading, IconButton, Image, Tag, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { FaStar, FaRegStar, FaImage } from 'react-icons/fa'
import type { Material } from '../../../types/material.types'
import useFavoritosStore from '../../../store/useFavoritosStore'
import { Paths } from '../../../router/routes'

interface MaterialCardProps {
  material: Material
}

const MaterialCard = ({ material }: MaterialCardProps) => {
  const favoritos = useFavoritosStore((state) => state.favoritos)
  const alternar = useFavoritosStore((state) => state.alternar)
  const esFavorito = favoritos.includes(material.id)

  return (
    <Card overflow="hidden" _hover={{ shadow: 'md' }} transition="box-shadow 0.15s">
      <Box position="relative" bg="gray.100" h="180px">
        {material.imagenUrl ? (
          <Image
            src={material.imagenUrl}
            alt={material.nombreComun}
            objectFit="cover"
            w="100%"
            h="100%"
          />
        ) : (
          <VStack justify="center" h="100%" color="gray.400" gap="0.5rem">
            <FaImage size={28} />
            <Text fontSize="xs">Sin fotografía</Text>
          </VStack>
        )}

        <IconButton
          aria-label={esFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
          icon={esFavorito ? <FaStar /> : <FaRegStar />}
          size="sm"
          position="absolute"
          top="0.5rem"
          right="0.5rem"
          colorScheme={esFavorito ? 'yellow' : 'gray'}
          onClick={() => alternar(material.id)}
        />
      </Box>

      <CardBody>
        <VStack align="stretch" gap="0.5rem">
          <Heading
            size="sm"
            as={RouterLink}
            to={Paths.materialDetalle(material.id)}
            _hover={{ color: 'teal.600', textDecoration: 'underline' }}
          >
            {material.nombreComun}
          </Heading>

          <Text fontSize="xs" color="gray.500" fontFamily="mono">
            {material.codigoNisira}
          </Text>

          <Text fontSize="xs" color="gray.600" noOfLines={2}>
            {material.descripcionNisira}
          </Text>

          <HStack gap="0.4rem" wrap="wrap" pt="0.25rem">
            <Tag size="sm" colorScheme="teal">{material.grupo}</Tag>
            <Tag size="sm" variant="subtle">{material.unidadMedida}</Tag>
            {material.estado === 'inactivo' && (
              <Badge colorScheme="red" fontSize="0.65rem">Inactivo</Badge>
            )}
          </HStack>

          <Text fontSize="xs" color="gray.500" pt="0.25rem">
            {material.equipoRelacionado}
          </Text>
        </VStack>
      </CardBody>
    </Card>
  )
}

export default MaterialCard
