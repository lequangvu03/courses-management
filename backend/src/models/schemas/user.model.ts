import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enums'
import { Role } from '~/constants/enums'

interface IUser {
  _id?: ObjectId
  name?: string
  email: string
  verify?: UserVerifyStatus
  date_of_birth?: number
  password: string
  avatar?: string
  email_verify_token?: string
  forgot_password_otp?: string
  created_at?: number
  updated_at?: number
  role?: Role
}

export default class User implements IUser {
  _id?: ObjectId | undefined
  name: string
  email: string
  date_of_birth?: number
  password: string
  avatar: string
  email_verify_token: string
  forgot_password_otp: string
  created_at: number
  updated_at: number
  verify: UserVerifyStatus
  role?: Role

  constructor({
    avatar,
    created_at,
    date_of_birth,
    email,
    name,
    password,
    updated_at,
    _id,
    verify,
    email_verify_token,
    forgot_password_otp,
    role
  }: IUser) {
    const date = Date.now()
    this._id = _id
    this.role = (role && +role) || Role.User
    this.avatar = avatar || ''
    this.created_at = created_at || date
    this.updated_at = updated_at || date
    this.email_verify_token = email_verify_token || ''
    this.forgot_password_otp = forgot_password_otp || ''
    this.date_of_birth = date_of_birth
    this.verify = verify || UserVerifyStatus.Unverified
    this.email = email || ''
    this.name = name || ''
    this.password = password || ''
  }
}
