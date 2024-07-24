import { useEffect } from 'react'
import useRouteElements from './hooks/useRouteElements'
import useAuthStore from './stores/auth.store'

function App() {
  const { checkAuth } = useAuthStore()
  const elements = useRouteElements()
  useEffect(() => {
    checkAuth()
  }, [])
  return <div>{elements}</div>
}

export default App
