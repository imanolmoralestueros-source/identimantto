import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import { Paths } from '../routes'

const RutaPublica = () => {
  const usuario = useAuthStore((state) => state.usuario)

  if (usuario) {
    return <Navigate to={Paths.inicio} replace />
  }

  return <Outlet />
}

export default RutaPublica
