import { Role, UserVerifyStatus } from '../constants/enums'

export interface IUser {
  _id?: string
  name?: string
  email: string
  role: Role
  verify: UserVerifyStatus
  date_of_birth?: number
  avatar?: string
  created_at?: number
  updated_at?: number
}

export interface IStudent {
  _id: string
  avatar: string
  name: string
  email: string
  phone: string
  enroll_number: string
  date_of_admission: number
  created_at: number
  updated_at: number
}

export interface IAddStudentBody extends Omit<IStudent, '_id' | 'updated_at' | 'created_at'> {}

export interface ILoginFormData {
  email: string
  password: string
  remember_me: boolean
}
export interface IRegisterFormData {
  email: string
  password: string
  confirm_password: string
}

export interface IResetPasswordFormData {
  email: string
  new_password: string
  confirm_new_password: string
  otp_id: string
  role?: Role
}

export interface IStudentUpsertFormData extends Omit<IStudent, '_id' | 'created_at' | 'updated_at'> {}

export interface IQueryParams {
  limit?: number
  page?: number
  sort_by?: string
  sort_order?: string
  search?: string
}
