import { Box, Heading, Text, VStack } from '@chakra-ui/react'

interface EstadoVacioProps {
  titulo: string
  descripcion: string
}

const EstadoVacio = ({ titulo, descripcion }: EstadoVacioProps) => (
  <Box borderWidth="1px" borderStyle="dashed" borderColor="gray.300" borderRadius="lg" py="3rem" px="2rem">
    <VStack gap="0.5rem">
      <Heading size="md" color="gray.700">{titulo}</Heading>
      <Text color="gray.500" textAlign="center">{descripcion}</Text>
    </VStack>
  </Box>
)

export default EstadoVacio
