import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, VStack } from '@chakra-ui/react'

interface MensajeErrorProps {
  titulo?: string
  detalle: string
  onReintentar?: () => void
}

const MensajeError = ({ titulo = 'No se pudo cargar la información', detalle, onReintentar }: MensajeErrorProps) => (
  <Alert status="error" borderRadius="md" py="1.5rem">
    <AlertIcon />
    <VStack align="start" gap="0.75rem" w="100%">
      <AlertTitle>{titulo}</AlertTitle>
      <AlertDescription>{detalle}</AlertDescription>
      {onReintentar && (
        <Button size="sm" colorScheme="red" variant="outline" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </VStack>
  </Alert>
)

export default MensajeError
