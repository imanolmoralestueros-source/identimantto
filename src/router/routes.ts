export const Paths = {
  login: '/login',
  inicio: '/inicio',
  materiales: '/materiales',
  materialDetalle: (id: string = ':id') => `/materiales/${id}`
} as const
