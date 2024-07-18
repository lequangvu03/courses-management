import User from './models/schemas/user.model'
import { Request } from 'express'
import { TokenPayload } from './types/requests/auth.requests'

declare module 'express' {
  interface Request {
    user?: User
    otp?: ForgotPasswordOTP
    decoded_access_token?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
