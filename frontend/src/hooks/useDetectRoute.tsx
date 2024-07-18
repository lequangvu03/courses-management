import { useLocation } from 'react-router-dom'
import { isAdminRoute } from '../lib/utils'

function useAdminRoute() {
  const location = useLocation()

  return {
    isAdmin: isAdminRoute(location.pathname)
  }
}

export default useAdminRoute
