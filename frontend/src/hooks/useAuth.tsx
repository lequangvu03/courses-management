import { useContext } from 'react'
import { AppContext, IAppContext } from '../contexts/app.context'

function useAuth() {
  return useContext<IAppContext>(AppContext)
}

export default useAuth
