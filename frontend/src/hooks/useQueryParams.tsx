import { useLocation } from 'react-router-dom'

function useQueryParams() {
  const location = useLocation()
  return { location, params: new URLSearchParams(location.search) }
}

export default useQueryParams
