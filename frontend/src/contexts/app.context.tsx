import { IUser } from '../types/types'
import { getProfileFromCookie, getRefreshTokenFromCookie, getRoleFromCookie, isAdminRoute } from '../lib/utils'
import { createContext, ReactNode, useState } from 'react'
import { Role, UserVerifyStatus } from '../constants/enums'

export interface IAppContext {
  isAuthenticated: boolean
  profile: IUser | null
  setProfile: React.Dispatch<React.SetStateAction<IUser | null>>
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  reset: () => void
}

const initialState: IAppContext = {
  isAuthenticated:
    Boolean(getRefreshTokenFromCookie()) &&
    getProfileFromCookie() &&
    (getProfileFromCookie() as IUser).verify === UserVerifyStatus.Verify,

  profile: getProfileFromCookie(),
  setIsAuthenticated: () => null,
  setProfile: () => null,
  reset: () => null
}

export const AppContext = createContext(initialState)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const role = getRoleFromCookie()
    const isAdmin = isAdminRoute(location.pathname) && role === Role.Admin
    const isUser = !isAdminRoute(location.pathname) && role === Role.User

    return (initialState.isAuthenticated && isAdmin) || (initialState.isAuthenticated && isUser)
  })

  const [profile, setProfile] = useState<IUser | null>(initialState.profile)

  const reset = () => {
    setIsAuthenticated(false)
    setProfile(null)
  }

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        profile,
        setIsAuthenticated,
        setProfile,
        reset
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
