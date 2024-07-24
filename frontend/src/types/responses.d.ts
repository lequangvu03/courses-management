import { OTPVerifyStatus } from '../constants/enums'
import { IStudent, IUser } from './types'

export interface SuccessResponse<TData> {
  message: string
  data: TData
}

export interface ErrorResponse<TData> {
  message: string
  data?: TData
}

export type RefreshTokenResponse = SuccessResponse<object>

export type AuthResponse = SuccessResponse<{
  user: IUser
}>

export type RequestChangePasswordResponse = SuccessResponse<{
  _id: string
  status: OTPVerifyStatus
  expires_at: number
  created_at: number
}>

export type GetStudentListResponse = SuccessResponse<{
  limit: number
  page: number
  total_pages: number
  students: IStudent[]
}>
