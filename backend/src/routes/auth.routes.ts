import { Router } from 'express'
import {
  getStudentsController,
  loginController,
  logoutController,
  refreshTokenController,
  requestChangePasswordController,
  resetPasswordController,
  verifyOTPController
} from '~/controllers/user.controllers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  registerValidator,
  requestChangePasswordValidator,
  resetPasswordValidator,
  verifyOTPValidator
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
 * path: /auth/request-reset-password
 * method: POST
 * body: { email: string, role?: Role}
 */

authRouter.post(
  '/auth/request-reset-password',
  requestChangePasswordValidator,
  wrapRequestHandler(requestChangePasswordController)
)

/**
 * path: /auth/verify-otp
 * method: POST
 * body: { forgot_password_otp: string, otp_id: string }
 */

authRouter.post('/auth/verify-otp', verifyOTPValidator, wrapRequestHandler(verifyOTPController))

/**
 * path: /auth/reset-password
 * method: PUT
 * body: { email: string, new_password: string, confirm_new_password: string, role?: Role }
 */

authRouter.put('/auth/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

/**
 * path: /students
 * method: GET
 * headers: { Authorization: Bearer <access_token> }
 */

authRouter.get('/students', accessTokenValidator, wrapRequestHandler(getStudentsController))

export default authRouter
