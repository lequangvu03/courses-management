import { ObjectId } from 'mongodb'

export interface IStudent {
  _id?: ObjectId
  avatar: string
  name: string
  email: string
  phone: string
  enrollNumber: string
  dateOfAdmission: string
  created_at?: number
  updated_at?: number
}

export default class Student implements IStudent {
  _id?: ObjectId
  avatar: string
  name: string
  email: string
  phone: string
  enrollNumber: string
  dateOfAdmission: string
  created_at: number
  updated_at: number

  constructor({ _id, dateOfAdmission, email, enrollNumber, avatar, name, phone, created_at, updated_at }: IStudent) {
    const now = Date.now()
    this._id = _id
    this.dateOfAdmission = dateOfAdmission
    this.email = email
    this.name = name
    this.phone = phone
    this.enrollNumber = enrollNumber
    this.avatar = avatar
    this.created_at = created_at || now
    this.updated_at = updated_at || now
  }
}
