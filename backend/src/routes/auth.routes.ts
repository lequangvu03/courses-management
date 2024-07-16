import { Router } from 'express'
import {
  getStudentsController,
  loginController,
  logoutController,
  refreshTokenController
} from '~/controllers/user.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  registerValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { registerController, verifyEmailController } from '~/controllers/user.controllers'

const authRouter = Router()

/**
 * path: /auth/login
 * method: POST
 * body: {email: string, password: string}
 */

authRouter.post('/auth/login', loginValidator, wrapRequestHandler(loginController))

/**
 * path: /auth/refresh-token
 * method: GET
 * body: {refresh_token: string}
 */

authRouter.post('/auth/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * path: /auth/resend-verify-token
 * method: post
 * body: {email: string}
 */

authRouter.post('/auth/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * path: /auth/register
 * method: POST
 * body:{ email: string, password: string, confirm_password}
 */

authRouter.post('/auth/register', registerValidator, wrapRequestHandler(registerController))

/**
 * path: /auth/verify-email?token=<email_verified_token>
 * method: GET
 * query: {token: string}
 */

authRouter.get('/auth/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * path: /students
 * method: GET
 * headers: { Authorization: Bearer <access_token> }
 */

authRouter.get('/students', accessTokenValidator, wrapRequestHandler(getStudentsController))

export default authRouter
