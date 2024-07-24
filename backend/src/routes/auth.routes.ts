import { Router } from 'express'
import {
  authController,
  loginController,
  logoutController,
  refreshTokenController,
  requestChangePasswordController,
  resetPasswordController,
  verifyOTPController
} from '~/controllers/auth.controllers'
import {
  loginValidator,
  refreshTokenValidator,
  emailVerifyTokenValidator,
  registerValidator,
  requestChangePasswordValidator,
  resetPasswordValidator,
  verifyOTPValidator,
  accessTokenValidator
} from '~/middlewares/auth.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
import { registerController, verifyEmailController } from '~/controllers/auth.controllers'

const authRouter = Router()

/**
 * path: /auth/login
 * method: POST
 * body: {email: string, password: string}
 */

authRouter.post('/login', loginValidator, wrapRequestHandler(loginController))

/**
 * path: /profile
 * method: GET
 * cookie: { access_token: string }
 */
authRouter.get('/profile', accessTokenValidator, wrapRequestHandler(authController))

/**
 * path: /auth/refresh-token
 * method: GET
 * cookie: { refresh_token: string }
 */

authRouter.post('/refresh-token', refreshTokenValidator, wrapRequestHandler(refreshTokenController))

/**
 * path: /auth/resend-verify-token
 * method: post
 * body: {email: string}
 */

authRouter.post('/logout', refreshTokenValidator, wrapRequestHandler(logoutController))

/**
 * path: /auth/register
 * method: POST
 * body:{ email: string, password: string, confirm_password}
 */

authRouter.post('/register', registerValidator, wrapRequestHandler(registerController))

/**
 * path: /auth/verify-email?token=<email_verified_token>
 * method: GET
 * query: { token: string }
 */

authRouter.get('/verify-email', emailVerifyTokenValidator, wrapRequestHandler(verifyEmailController))

/**
 * path: /auth/request-reset-password
 * method: POST
 * body: { email: string, role?: Role }
 */

authRouter.post(
  '/request-reset-password',
  requestChangePasswordValidator,
  wrapRequestHandler(requestChangePasswordController)
)

/**
 * path: /auth/verify-otp
 * method: POST
 * body: { forgot_password_otp: string, otp_id: string }
 */

authRouter.post('/verify-otp', verifyOTPValidator, wrapRequestHandler(verifyOTPController))

/**
 * path: /auth/reset-password
 * method: PUT
 * body: { email: string, new_password: string, confirm_new_password: string, role?: Role }
 */

authRouter.put('/reset-password', resetPasswordValidator, wrapRequestHandler(resetPasswordController))

export default authRouter
