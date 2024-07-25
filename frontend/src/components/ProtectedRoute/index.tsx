import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { publicAdminRoutes } from '../../config/admin.routes'
import { publicUserRoutes } from '../../config/user.routes'
import { isAdminRoute } from '../../lib/utils'
import useAuthStore from '../../stores/auth.store'

function ProtectedRoute() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  const isAdmin = isAdminRoute(location.pathname)

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate
      to={isAdmin ? publicAdminRoutes.signin : publicUserRoutes.signin}
      state={{
        from: location,
        search: location.search
      }}
      replace
    />
  )
}
export default ProtectedRoute
