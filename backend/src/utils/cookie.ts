import { CookieOptions, Response } from 'express'
import envs from '~/constants/env-variables'

export const setCookie = (res: Response, name: string, value: any, options?: CookieOptions) => {
  res.cookie(name, value, {
    ...options,
    httpOnly: true,
    secure: envs.isProduction,
    sameSite: 'lax'
  })
}
