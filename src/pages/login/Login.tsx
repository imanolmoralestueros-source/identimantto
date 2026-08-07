import { useState } from 'react'
import {
  Alert, AlertIcon, Box, Button, Code, Flex, FormControl, FormLabel,
  Heading, Input, Text, VStack
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { Paths } from '../../router/routes'

const Login = () => {
  const iniciarSesion = useAuthStore((state) => state.iniciarSesion)
  const navigate = useNavigate()

  const [correo, setCorreo] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const enviar = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setEnviando(true)

    try {
      iniciarSesion({ correo, password })
      navigate(Paths.inicio, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo iniciar sesión.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="marca.700" px="1rem">
      <Box bg="white" borderRadius="xl" p="2.5rem" w="100%" maxW="420px" boxShadow="xl">
        <VStack align="stretch" gap="1.5rem">
          <VStack align="start" gap="0.25rem">
            <Heading size="lg">IdentiMantto</Heading>
            <Text color="gray.600" fontSize="sm">
              Identificación visual de materiales de mantenimiento
            </Text>
          </VStack>

          {error && (
            <Alert status="error" borderRadius="md" fontSize="sm">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <VStack as="form" align="stretch" gap="1rem" onSubmit={enviar}>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Correo</FormLabel>
              <Input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="tecnico@mantenimiento.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel fontSize="sm">Contraseña</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <Button type="submit" colorScheme="marca" isLoading={enviando} loadingText="Verificando">
              Entrar
            </Button>
          </VStack>

          <Box bg="arena.100" borderRadius="md" p="1rem" fontSize="xs" color="gray.600">
            <Text fontWeight="semibold" mb="0.5rem">Usuarios de prueba</Text>
            <Text>Técnico — <Code fontSize="xs">tecnico@mantenimiento.com</Code> / <Code fontSize="xs">tecnico123</Code></Text>
            <Text>Planificador — <Code fontSize="xs">planificador@mantenimiento.com</Code> / <Code fontSize="xs">plan123</Code></Text>
          </Box>
        </VStack>
      </Box>
    </Flex>
  )
}

export default Login
