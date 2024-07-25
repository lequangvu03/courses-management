import User from './models/schemas/user.model'
import { Request } from 'express'
import { TokenPayload } from './types/requests/requests'
import Student from './models/schemas/student.model'

declare module 'express' {
  interface Request {
    user?: User
    otp?: ForgotPasswordOTP
    student?: Student
    decoded_access_token?: TokenPayload
    decoded_refresh_token?: TokenPayload
    decoded_email_verify_token?: TokenPayload
  }
}
