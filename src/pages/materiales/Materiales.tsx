import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box, Checkbox, Heading, HStack, Input, InputGroup, InputLeftElement,
  Select, SimpleGrid, Text, VStack
} from '@chakra-ui/react'
import { FaSearch } from 'react-icons/fa'
import { obtenerMateriales } from '../../services/materialesService'
import type { Material } from '../../types/material.types'
import MaterialCard from './components/MaterialCard'
import Cargando from '../../components/Cargando'
import MensajeError from '../../components/MensajeError'
import EstadoVacio from '../../components/EstadoVacio'
import useFavoritosStore from '../../store/useFavoritosStore'

const normalizar = (texto: string) =>
  texto.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

const Materiales = () => {
  const [materiales, setMateriales] = useState<Material[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [busqueda, setBusqueda] = useState('')
  const [grupo, setGrupo] = useState('')
  const [equipo, setEquipo] = useState('')
  const [soloSinFoto, setSoloSinFoto] = useState(false)
  const [soloFavoritos, setSoloFavoritos] = useState(false)

  const favoritos = useFavoritosStore((state) => state.favoritos)

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

  const grupos = useMemo(
    () => [...new Set(materiales.map((m) => m.grupo))].sort(),
    [materiales]
  )

  const equipos = useMemo(
    () => [...new Set(materiales.map((m) => m.equipoRelacionado))].sort(),
    [materiales]
  )

  const filtrados = useMemo(() => {
    const termino = normalizar(busqueda.trim())

    return materiales.filter((m) => {
      const coincideTexto =
        termino === '' ||
        normalizar(m.codigoNisira).includes(termino) ||
        normalizar(m.nombreComun).includes(termino) ||
        normalizar(m.descripcionNisira).includes(termino) ||
        normalizar(m.equipoRelacionado).includes(termino) ||
        m.palabrasClave.some((p) => normalizar(p).includes(termino))

      const coincideGrupo = grupo === '' || m.grupo === grupo
      const coincideEquipo = equipo === '' || m.equipoRelacionado === equipo
      const coincideFoto = !soloSinFoto || !m.imagenUrl
      const coincideFavorito = !soloFavoritos || favoritos.includes(m.id)

      return coincideTexto && coincideGrupo && coincideEquipo && coincideFoto && coincideFavorito
    })
  }, [materiales, busqueda, grupo, equipo, soloSinFoto, soloFavoritos, favoritos])

  if (cargando) return <Cargando />
  if (error) return <MensajeError detalle={error} onReintentar={cargar} />

  return (
    <VStack align="stretch" gap="1.5rem">
      <Box>
        <Heading size="lg">Catálogo de materiales</Heading>
        <Text color="gray.600" mt="0.25rem" fontSize="sm">
          Busca por código Nisira, nombre de taller, descripción o equipo.
        </Text>
      </Box>

      <VStack align="stretch" gap="0.75rem">
        <InputGroup>
          <InputLeftElement pointerEvents="none" color="gray.400">
            <FaSearch />
          </InputLeftElement>
          <Input
            bg="white"
            placeholder="pitón, llanta, 260104500264, fumigadora…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </InputGroup>

        <HStack gap="0.75rem" wrap="wrap">
          <Select bg="white" maxW="220px" value={grupo} onChange={(e) => setGrupo(e.target.value)}>
            <option value="">Todos los grupos</option>
            {grupos.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>

          <Select bg="white" maxW="260px" value={equipo} onChange={(e) => setEquipo(e.target.value)}>
            <option value="">Todos los equipos</option>
            {equipos.map((eq) => <option key={eq} value={eq}>{eq}</option>)}
          </Select>

          <Checkbox isChecked={soloSinFoto} onChange={(e) => setSoloSinFoto(e.target.checked)}>
            <Text fontSize="sm">Solo sin fotografía</Text>
          </Checkbox>

          <Checkbox isChecked={soloFavoritos} onChange={(e) => setSoloFavoritos(e.target.checked)}>
            <Text fontSize="sm">Solo favoritos</Text>
          </Checkbox>
        </HStack>

        <Text fontSize="sm" color="gray.500">
          {filtrados.length} de {materiales.length} materiales
        </Text>
      </VStack>

      {filtrados.length === 0 ? (
        <EstadoVacio
          titulo="Ningún material coincide"
          descripcion="Prueba con el código Nisira, el nombre que usan en taller o el equipo donde se instala."
        />
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap="1rem">
          {filtrados.map((material) => (
            <MaterialCard key={material.id} material={material} />
          ))}
        </SimpleGrid>
      )}
    </VStack>
  )
}

export default Materiales
