import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box, Button, Card, CardBody, Heading, HStack, SimpleGrid, Stat,
  StatLabel, StatNumber, StatHelpText, Text, VStack
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { obtenerMateriales } from '../../services/materialesService'
import type { Material } from '../../types/material.types'
import useAuthStore from '../../store/useAuthStore'
import useFavoritosStore from '../../store/useFavoritosStore'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import { Paths } from '../../router/routes'

const Inicio = () => {
  const usuario = useAuthStore((state) => state.usuario)
  const favoritos = useFavoritosStore((state) => state.favoritos)

  const [materiales, setMateriales] = useState<Material[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const cargar = useCallback(async () => {
    setCargando(true)
    setError(null)
    try {
      const data = await obtenerMateriales()
      setMateriales(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido.')
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    cargar()
  }, [cargar])

  const resumen = useMemo(() => {
    const sinFotografia = materiales.filter((m) => !m.imagenUrl).length
    const grupos = new Set(materiales.map((m) => m.grupo)).size
    return {
      total: materiales.length,
      sinFotografia,
      activos: materiales.filter((m) => m.estado === 'activo').length,
      grupos
    }
  }, [materiales])

  const porEquipo = useMemo(() => {
    const conteo = new Map<string, number>()
    materiales.forEach((m) => {
      conteo.set(m.equipoRelacionado, (conteo.get(m.equipoRelacionado) ?? 0) + 1)
    })
    return [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6)
  }, [materiales])

  if (cargando) return <Cargando />
  if (error) return <MensajeError detalle={error} onReintentar={cargar} />

  return (
    <VStack align="stretch" gap="2rem">
      <Box>
        <Heading size="lg">Hola, {usuario?.nombre}</Heading>
        <Text color="gray.600" mt="0.25rem">
          Resumen del catálogo de materiales de mantenimiento.
        </Text>
      </Box>

      <SimpleGrid columns={{ base: 2, md: 4 }} gap="1rem">
        <Card><CardBody>
          <Stat><StatLabel>Materiales</StatLabel><StatNumber>{resumen.total}</StatNumber></Stat>
        </CardBody></Card>

        <Card borderTopWidth="3px" borderTopColor={resumen.sinFotografia > 0 ? 'orange.400' : 'green.400'}>
          <CardBody>
            <Stat>
              <StatLabel>Sin fotografía</StatLabel>
              <StatNumber>{resumen.sinFotografia}</StatNumber>
              <StatHelpText mb="0">
                {resumen.sinFotografia > 0 ? 'Pendientes de registrar' : 'Catálogo completo'}
              </StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card><CardBody>
          <Stat><StatLabel>Equipos cubiertos</StatLabel><StatNumber>{porEquipo.length}</StatNumber></Stat>
        </CardBody></Card>

        <Card><CardBody>
          <Stat><StatLabel>Favoritos</StatLabel><StatNumber>{favoritos.length}</StatNumber></Stat>
        </CardBody></Card>
      </SimpleGrid>

      <Card>
        <CardBody>
          <Heading size="sm" mb="1rem">Materiales por equipo</Heading>
          <VStack align="stretch" gap="0.5rem">
            {porEquipo.map(([equipo, cantidad]) => (
              <HStack key={equipo} justify="space-between" borderBottomWidth="1px" borderColor="gray.100" pb="0.35rem">
                <Text fontSize="sm">{equipo}</Text>
                <Text fontSize="sm" fontWeight="semibold" color="marca.700">{cantidad}</Text>
              </HStack>
            ))}
            {porEquipo.length === 0 && (
              <Text fontSize="sm" color="gray.500">Todavía no hay materiales registrados.</Text>
            )}
          </VStack>
        </CardBody>
      </Card>

      <HStack>
        <Button as={RouterLink} to={Paths.materiales} colorScheme="marca">
          Ver catálogo completo
        </Button>
      </HStack>
    </VStack>
  )
}

export default Inicio
