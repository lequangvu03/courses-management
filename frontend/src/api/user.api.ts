import { Role } from '../constants/enums'
import { getRefreshTokenFromCookie } from '../lib/utils'
import { AuthResponse, RequestChangePasswordResponse, SuccessResponse } from '../types/responses'
import { IResetPasswordFormData } from '../types/types'
import request from './axios'

const authApi = {
  login: (args: { email: string; password: string; role?: Role }) => {
    return request.post<AuthResponse>('/auth/login', args)
  },
  register: (args: { email: string; password: string; confirm_password: string; role?: Role }) => {
    return request.post<SuccessResponse<object>>('/auth/register', args)
  },
  logout: () => {
    return request.post('/auth/logout', {
      refresh_token: getRefreshTokenFromCookie()
    })
  },
  requestChangePassword: (args: { email: string; role?: Role }) => {
    return request.post<RequestChangePasswordResponse>('/auth/request-reset-password', args)
  },
  verifyOTP: (args: { forgot_password_otp: string; otp_id: string }) => {
    return request.post<SuccessResponse<object>>('/auth/verify-otp', args)
  },
  resetPassword: (args: IResetPasswordFormData) => {
    return request.put<SuccessResponse<object>>('/auth/reset-password', args)
  }
}

export default authApi
