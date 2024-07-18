import { OTPVerifyStatus } from '../constants/enums'
import { IUser } from './types'

export interface SuccessResponse<TData> {
  message: string
  data: TData
}

export interface ErrorResponse<TData> {
  message: string
  data?: TData
}

export type RefreshTokenResponse = SuccessResponse<{
  access_token: string
}>

export type AuthResponse = SuccessResponse<{
  refresh_token: string
  access_token: string
  user: IUser
}>

export type RequestChangePasswordResponse = SuccessResponse<{
  _id: string
  status: OTPVerifyStatus
  expires_at: number
  created_at: number
}>
