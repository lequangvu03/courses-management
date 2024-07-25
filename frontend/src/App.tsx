import { Suspense, useEffect } from 'react'
import useRouteElements from './hooks/useRouteElements'
import useAuthStore from './stores/auth.store'
import { useShallow } from 'zustand/react/shallow'

function App() {
  const checkAuth = useAuthStore(useShallow((state) => state.checkAuth))
  const elements = useRouteElements()
  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <div>
      <Suspense fallback={<h2>Loading...</h2>}>{elements}</Suspense>
    </div>
  )
}

export default App
