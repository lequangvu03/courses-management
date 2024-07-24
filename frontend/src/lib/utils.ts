import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import HTTP_RESPONSE_STATUS_CODES from '../constants/http-status-codes'
import { ErrorResponse } from '../types/responses'

import { Role } from '../constants/enums'
import { decrypt, encrypt } from './crypto'

export const formatNumber = (number: number) => new Intl.NumberFormat().format(number)

export const isAxiosError = <T>(error: unknown): error is AxiosError<T> => {
  return axios.isAxiosError(error)
}

export const isAxiosUnprocessableEntityError = <UnprocessableEntityError>(
  error: unknown
): error is AxiosError<UnprocessableEntityError> => {
  return (
    isAxiosError<UnprocessableEntityError>(error) &&
    error.response?.status === HTTP_RESPONSE_STATUS_CODES.UNPROCESSABLE_CONTENT
  )
}

export const isAxiosUnauthorizedError = <UnauthorizedError>(error: unknown): error is AxiosError<UnauthorizedError> => {
  return isAxiosError<UnauthorizedError>(error) && error.response?.status === HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
}

export const isAxiosExpiredAccessTokenError = <ExpiredAccessTokenError>(
  error: unknown
): error is AxiosError<ExpiredAccessTokenError> => {
  return isAxiosUnauthorizedError<
    ErrorResponse<{
      message: string
      name: string
    }>
  >(error)
}

export const getRememberMeFromCookie = (role: Role = Role.User) => {
  return Cookies.get(role === Role.Admin ? 'admin_remember_me' : 'remember_me')
}

export const getEmailFromCookie = (role: Role = Role.User) => {
  return decrypt(Cookies.get(role === Role.Admin ? 'admin_email' : 'email') || '')
}

export const getPasswordFromCookie = (role: Role = Role.User) => {
  return decrypt(Cookies.get(role === Role.Admin ? 'admin_password' : 'password') || '')
}

export const setRememberMeToCookie = (value: boolean, role: Role = Role.User) => {
  Cookies.set(role === Role.Admin ? 'admin_remember_me' : 'remember_me', String(value), {
    expires: 365
  })
}

export const setEmailFromCookie = (email: string, role: Role = Role.User) => {
  Cookies.set(role === Role.Admin ? 'admin_email' : 'email', encrypt(email), {
    expires: 365
  })
}

export const setPasswordFromCookie = (password: string, role: Role = Role.User) => {
  Cookies.set(role === Role.Admin ? 'admin_password' : 'password', encrypt(password), {
    expires: 365
  })
}

export const removeRememberMeFromCookie = (role: Role = Role.User) => {
  Cookies.remove(role === Role.Admin ? 'admin_email' : 'email')
  Cookies.remove(role === Role.Admin ? 'admin_password' : 'password')
  Cookies.remove(role === Role.Admin ? 'admin_remember_me' : 'remember_me')
}

export const isAdminRoute = (pathname: string) => {
  return pathname.includes('admin')
}

export const formatTime = (epochTime: number) => {
  const date = new Date(epochTime * 1000) // Chuyển epoch time thành milliseconds và tạo đối tượng Date

  return new Intl.DateTimeFormat('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(date)
}
