import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { isAxiosExpiredAccessTokenError, isAxiosUnauthorizedError } from '../lib/utils'
import { RefreshTokenResponse } from '../types/responses'
import authApi from './auth.api'

class Request {
  instance: AxiosInstance

  private refreshTokenRequest: Promise<string | undefined> | null

  constructor() {
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: import.meta.env.VITE_BASE_URL,
      timeout: 5000,
      withCredentials: true
    })

    this.instance.interceptors.request.use(
      (config) => config,
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (isAxiosUnauthorizedError(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config

          if (
            isAxiosExpiredAccessTokenError<{
              message: string
              name: string
            }>(error) &&
            url !== 'refresh-token'
          ) {
            this.refreshTokenRequest = this.refreshTokenRequest ? this.refreshTokenRequest : this.handleRefreshToken()

            return this.refreshTokenRequest
              .then(() => {
                // Tiếp tục request cũ
                return this.instance(config)
              })
              .catch((error) => {
                throw error
              })
              .finally(() => {
                setTimeout(() => {
                  this.refreshTokenRequest = null
                }, 10000)
              })
          }
        }

        return Promise.reject(error)
      }
    )
  }
  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>('/auth/refresh-token')
      .then((res) => {
        console.log(res)
        return undefined
      })
      .catch(async (error) => {
        await authApi.logout()
        throw error
      })
  }
}

const request = new Request().instance

export default request
