import { Button, Center, Heading, Text, VStack } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import { Paths } from '../router/routes'

const Error404 = () => (
  <Center minH="100vh" bg="gray.50" px="1rem">
    <VStack gap="1rem">
      <Heading size="2xl" color="teal.700">404</Heading>
      <Text color="gray.600" textAlign="center">
        Esta dirección no corresponde a ninguna pantalla del catálogo.
      </Text>
      <Button as={RouterLink} to={Paths.inicio} colorScheme="teal">
        Ir al inicio
      </Button>
    </VStack>
  </Center>
)

export default Error404
