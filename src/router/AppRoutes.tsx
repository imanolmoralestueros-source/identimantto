import { Navigate, Route, Routes } from 'react-router-dom'
import RutaPrivada from './outlets/RutaPrivada'
import RutaPublica from './outlets/RutaPublica'
import Login from '../pages/login/Login'
import Inicio from '../pages/inicio/Inicio'
import Materiales from '../pages/materiales/Materiales'
import MaterialDetalle from '../pages/materiales/MaterialDetalle'
import Error404 from '../pages/Error404'
import { Paths } from './routes'

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<RutaPublica />}>
        <Route path={Paths.login} element={<Login />} />
      </Route>

      <Route element={<RutaPrivada />}>
        <Route path={Paths.inicio} element={<Inicio />} />
        <Route path={Paths.materiales} element={<Materiales />} />
        <Route path={Paths.materialDetalle()} element={<MaterialDetalle />} />
      </Route>

      <Route path="/" element={<Navigate to={Paths.inicio} replace />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  )
}

export default AppRoutes
