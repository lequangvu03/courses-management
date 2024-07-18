import { ObjectId } from 'mongodb'
import { OTPVerifyStatus } from '~/constants/enums'

interface IForgotPasswordOTP {
  _id?: ObjectId
  user_id: ObjectId
  otp: string
  expires_at?: number
  created_at?: number
  status?: OTPVerifyStatus
}

export default class ForgotPasswordOTP implements IForgotPasswordOTP {
  _id?: ObjectId
  user_id: ObjectId
  otp: string
  expires_at: number
  created_at: number
  status: OTPVerifyStatus

  constructor({ expires_at, otp, user_id, _id, created_at, status }: IForgotPasswordOTP) {
    const now = Date.now()
    this._id = _id
    this.otp = otp
    this.user_id = user_id
    this.expires_at = expires_at || now + 120 * 1000 // 120s
    this.created_at = created_at || now
    this.status = status || OTPVerifyStatus.Unverified
  }
}
