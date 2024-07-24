import { useLocation } from 'react-router-dom'
import { isAdminRoute } from '../lib/utils'
import { Role } from '../constants/enums'

function useAdminRoute() {
  const location = useLocation()
  const role = isAdminRoute(location.pathname) ? Role.Admin : Role.User
  return {
    isAdmin: isAdminRoute(location.pathname),
    role
  }
}

export default useAdminRoute
