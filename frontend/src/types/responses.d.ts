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

export type EntityError = {
  location: string
  msg: string
  path: string
  type: string
  value: string
}
