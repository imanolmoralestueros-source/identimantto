import type { ReactNode } from 'react'
import { Badge, Box, Button, Container, Flex, HStack, Heading, Text } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { Paths } from '../../router/routes'

interface NavLayoutProps {
  children: ReactNode
}

const NavLayout = ({ children }: NavLayoutProps) => {
  const usuario = useAuthStore((state) => state.usuario)
  const cerrarSesion = useAuthStore((state) => state.cerrarSesion)
  const navigate = useNavigate()

  const salir = () => {
    cerrarSesion()
    navigate(Paths.login, { replace: true })
  }

  return (
    <Flex direction="column" minH="100vh" bg="arena.50">
      <Box as="header" bg="marca.700" color="white" py="0.85rem" px="1rem">
        <Container maxW="6xl">
          <Flex justify="space-between" align="center" gap="1rem" wrap="wrap">
            <HStack gap="1.5rem">
              <Heading size="md" letterSpacing="tight">
                IdentiMantto
              </Heading>
              <HStack gap="1rem" display={{ base: 'none', md: 'flex' }}>
                <Button as={RouterLink} to={Paths.inicio} variant="ghost" size="sm" _hover={{ bg: 'marca.600' }}>
                  Inicio
                </Button>
                <Button as={RouterLink} to={Paths.materiales} variant="ghost" size="sm" _hover={{ bg: 'marca.600' }}>
                  Materiales
                </Button>
              </HStack>
            </HStack>

            <HStack gap="0.75rem">
              {usuario && (
                <HStack gap="0.5rem" display={{ base: 'none', sm: 'flex' }}>
                  <Text fontSize="sm">{usuario.nombre}</Text>
                  <Badge colorScheme={usuario.rol === 'planificador' ? 'orange' : 'blue'}>
                    {usuario.rol === 'planificador' ? 'Planificador' : 'Técnico'}
                  </Badge>
                </HStack>
              )}
              <Button size="sm" colorScheme="whiteAlpha" onClick={salir}>
                Cerrar sesión
              </Button>
            </HStack>
          </Flex>

          <HStack gap="1rem" display={{ base: 'flex', md: 'none' }} pt="0.5rem">
            <Button as={RouterLink} to={Paths.inicio} variant="ghost" size="xs" _hover={{ bg: 'marca.600' }}>
              Inicio
            </Button>
            <Button as={RouterLink} to={Paths.materiales} variant="ghost" size="xs" _hover={{ bg: 'marca.600' }}>
              Materiales
            </Button>
          </HStack>
        </Container>
      </Box>

      <Box as="main" flex="1" py="2rem" px="1rem">
        <Container maxW="6xl">{children}</Container>
      </Box>

      <Box as="footer" py="1rem" px="1rem" borderTopWidth="1px" borderColor="arena.200">
        <Container maxW="6xl">
          <Text fontSize="xs" color="gray.500">
            IdentiMantto — Catálogo visual de materiales. Complementa a Nisira; no modifica sus registros.
          </Text>
        </Container>
      </Box>
    </Flex>
  )
}

export default NavLayout
