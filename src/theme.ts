import { extendTheme } from '@chakra-ui/react'

const theme = extendTheme({
  colors: {
    marca: {
      50: '#EAF3EC',
      100: '#C9E1D0',
      200: '#A3CCAF',
      300: '#7AB68C',
      400: '#55A171',
      500: '#2E7D45',
      600: '#256838',
      700: '#1C512C',
      800: '#133B1F',
      900: '#0A2412'
    },
    arena: {
      50: '#FAF8F3',
      100: '#F2EDE1',
      200: '#E5DCC9'
    },
    acento: {
      500: '#C1352B',
      600: '#A32B23'
    }
  },

  fonts: {
    heading: "'Outfit', system-ui, -apple-system, sans-serif",
    body: "'Inter', system-ui, -apple-system, sans-serif"
  },

  styles: {
    global: {
      body: {
        bg: 'arena.50',
        color: 'gray.800'
      }
    }
  },

  components: {
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          borderWidth: '1px',
          borderColor: 'arena.200',
          boxShadow: 'none',
          bg: 'white'
        }
      }
    },
    Heading: {
      baseStyle: {
        letterSpacing: '-0.02em',
        fontWeight: '600'
      }
    },
    Button: {
      baseStyle: {
        borderRadius: 'md',
        fontWeight: '600'
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: 'marca.500'
      }
    },
    Select: {
      defaultProps: {
        focusBorderColor: 'marca.500'
      }
    },
    Tag: {
      baseStyle: {
        container: {
          borderRadius: 'md',
          fontWeight: '500'
        }
      }
    }
  }
})

export default theme
