import { ObjectId } from 'mongodb'

interface IRefreshToken {
  _id?: ObjectId
  token: string
  created_at?: number
  user_id: ObjectId
}

export class RefreshToken implements IRefreshToken {
  _id?: ObjectId
  token: string
  created_at?: number | undefined
  user_id: ObjectId

  constructor({ _id, token, user_id, created_at }: IRefreshToken) {
    this._id = _id
    this.user_id = user_id
    this.created_at = created_at || Date.now()
    this.token = token
  }
}
