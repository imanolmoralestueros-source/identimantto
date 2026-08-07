import { Center, Spinner, Text, VStack } from '@chakra-ui/react'

interface CargandoProps {
  mensaje?: string
}

const Cargando = ({ mensaje = 'Cargando materiales…' }: CargandoProps) => (
  <Center py="4rem">
    <VStack gap="1rem">
      <Spinner size="xl" thickness="3px" color="teal.500" emptyColor="gray.200" />
      <Text color="gray.600">{mensaje}</Text>
    </VStack>
  </Center>
)

export default Cargando
