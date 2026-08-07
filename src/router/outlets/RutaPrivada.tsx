import { Navigate, Outlet } from 'react-router-dom'
import useAuthStore from '../../store/useAuthStore'
import NavLayout from '../../shared/layout/NavLayout'
import { Paths } from '../routes'

const RutaPrivada = () => {
  const usuario = useAuthStore((state) => state.usuario)

  if (!usuario) {
    return <Navigate to={Paths.login} replace />
  }

  return (
    <NavLayout>
      <Outlet />
    </NavLayout>
  )
}

export default RutaPrivada
