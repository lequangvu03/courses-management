import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { privateAdminRoutes } from '../../config/admin.routes'
import { privateUserRoutes } from '../../config/user.routes'
import { isAdminRoute } from '../../lib/utils'
import useAuthStore from '../../stores/auth.store'

function RejectedRoute() {
  const { isAuthenticated } = useAuthStore()
  const location = useLocation()
  const isAdmin = isAdminRoute(location.pathname)

  return isAuthenticated ? (
    <Navigate to={isAdmin ? privateAdminRoutes.dashboard : privateUserRoutes.home} />
  ) : (
    <Outlet />
  )
}

export default RejectedRoute
