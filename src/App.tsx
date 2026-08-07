import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './router/AppRoutes'
import theme from './theme'

const App = () => (
  <ChakraProvider theme={theme}>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </ChakraProvider>
)

export default App
