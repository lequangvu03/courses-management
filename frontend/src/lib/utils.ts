import axios, { AxiosError } from 'axios'
import Cookies from 'js-cookie'
import HTTP_RESPONSE_STATUS_CODES from '../constants/http-status-codes'
import { ErrorResponse } from '../types/responses'
import { IUser } from '../types/types'
import { Role } from '../constants/enums'

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

export const setAccessTokenToLocalCookie = (access_token: string) => {
  Cookies.set('access_token', access_token, {
    expires: 1 / 1440
  })
}

export const getAccessTokenFromCookie = () => {
  return Cookies.get('access_token') || ''
}

export const setRefreshTokenToCookie = (refresh_token: string) => {
  Cookies.set('refresh_token', refresh_token, {
    expires: 7
  })
}

export const getRefreshTokenFromCookie = () => {
  return Cookies.get('refresh_token') || ''
}
export const setRoleToCookie = (role: Role) => {
  Cookies.set('role', JSON.stringify(role), {
    expires: 7
  })
}
export const getRoleFromCookie = () => {
  const role = Cookies.get('role')
  return role ? +role : undefined
}

export const setProfileToCookie = (profile: IUser) => {
  Cookies.set('profile', JSON.stringify(profile), {
    expires: 7
  })
}

export const getProfileFromCookie = () => {
  const profile = Cookies.get('profile')
  return profile ? JSON.parse(profile) : null
}

export const setRememberMeToCookie = (value: boolean) => {
  Cookies.set('remember_me', JSON.stringify(value))
}

export const getRememberMeFromCookie = () => {
  const isRememerMe = Cookies.get('remember_me')
  return isRememerMe ? JSON.parse(isRememerMe) : false
}

export const removeAuthFromCookie = () => {
  Cookies.remove('access_token')
  Cookies.remove('refresh_token')
  Cookies.remove('profile')
  Cookies.remove('role')
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
