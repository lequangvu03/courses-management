import { ObjectId } from 'mongodb'

export interface IStudent {
  _id?: ObjectId
  avatar: string
  name: string
  email: string
  phone: string
  enroll_number: string
  date_of_admission: number
  created_at?: number
  updated_at?: number
}

export default class Student implements IStudent {
  _id?: ObjectId
  avatar: string
  name: string
  email: string
  phone: string
  enroll_number: string
  date_of_admission: number
  created_at: number
  updated_at: number

  constructor({ _id, date_of_admission, email, enroll_number, avatar, name, phone, created_at, updated_at }: IStudent) {
    const now = Date.now()
    this._id = _id
    this.date_of_admission = date_of_admission
    this.email = email
    this.name = name
    this.phone = phone
    this.enroll_number = enroll_number
    this.avatar = avatar
    this.created_at = created_at || now
    this.updated_at = updated_at || now
  }
}
