import { Role } from '../constants/enums'
import { getRefreshTokenFromCookie } from '../lib/utils'
import { AuthResponse, SuccessResponse } from '../types/responses'
import request from './axios'

const authApi = {
  login: (args: { email: string; password: string; role?: Role }) => request.post<AuthResponse>('/auth/login', args),
  register: (args: { email: string; password: string; confirm_password: string; role?: Role }) =>
    request.post<SuccessResponse<object>>('/auth/register', args),
  logout: () =>
    request.post('/auth/logout', {
      refresh_token: getRefreshTokenFromCookie()
    })
}

export default authApi
