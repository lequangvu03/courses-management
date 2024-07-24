import { create } from 'zustand'
import { IUser } from '../types/types'
import authApi from '../api/auth.api'
import { isAdminRoute } from '../lib/utils'
import { Role, UserVerifyStatus } from '../constants/enums'

interface State {
  isAuthenticated: boolean
  profile: IUser | null
  checkAuth: () => Promise<void>
}

interface Actions {
  setProfile: (profile: IUser) => void
  setIsAuthenticated: (isAuthenticated: boolean) => void
  reset: () => void
}

const useAuthStore = create<State & Actions>((set) => ({
  isAuthenticated: false,
  profile: null,
  reset: () =>
    set({
      profile: null,
      isAuthenticated: false
    }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setProfile: (profile) =>
    set((state) => ({
      ...state,
      profile
    })),
  checkAuth: async () => {
    const { data } = await authApi.getProfile()
    const profile = data?.data?.user
    if (!profile) return

    set(() => {
      const { role, verify } = profile as IUser
      const isAdmin = isAdminRoute(location.pathname) && role === Role.Admin
      const isUser = !isAdminRoute(location.pathname) && role === Role.User

      return {
        profile: profile,
        isAuthenticated: (isAdmin || isUser) && verify === UserVerifyStatus.Verify
      }
    })
  }
}))

export default useAuthStore
