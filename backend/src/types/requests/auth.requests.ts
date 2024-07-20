import type { JwtPayload } from 'jsonwebtoken'
import type { Query } from 'express-serve-static-core'
import { Role, TokenType, UserVerifyStatus } from '~/constants/enums'

export interface TokenPayload extends JwtPayload {
  user_id: string
  token: TokenType
  role: Role
  verify: UserVerifyStatus
}

export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  email: string
  password: string
  confirm_password: string
  role?: Role
}

export interface EmailVerifyReqQuery extends Query {
  token: string
}

export interface ResendEmailReqBody {
  email: string
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface VerifyOTPReqBody {
  forgot_password_otp: string
  otp_id: string
}
export interface ResetPasswordReqBody {
  email: string
  new_password: string
  confirm_new_password: string
  otp_id: string
  role?: Role
}

export interface StudentReqBody {
  avatar: string
  name: string
  email: string
  phone: string
  enrollNumber: string
  dateOfAdmission: string
}

export interface EditStudentReqBody extends Partial<StudentReqBody> {}
