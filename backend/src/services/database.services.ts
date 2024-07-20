import { MongoClient, Db, Collection } from 'mongodb'
import envs from '~/constants/env-variables'
import ForgotPasswordOTP from '~/models/schemas/forgot-password-otp.model'
import { RefreshToken } from '~/models/schemas/refresh-token.model'
import Student from '~/models/schemas/student.model'
import User from '~/models/schemas/user.model'

const uri = `mongodb+srv://${envs.dbUsername}:${envs.dbPassword}@twitter.o34ippp.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envs.dbName)
  }

  get users(): Collection<User> {
    return this.db.collection(envs.dbTableUserName)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envs.dbRefreshTokenName)
  }

  get forgotPasswordOTP(): Collection<ForgotPasswordOTP> {
    return this.db.collection(envs.dbTableForgotPasswordOTP)
  }

  get students(): Collection<Student> {
    return this.db.collection(envs.dbTableStudent)
  }
  async connect() {
    try {
      await this.client.connect()
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
      this.client.close()
      throw error
    }
  }

  async disconnect() {
    await this.client.close()
  }
}
const databaseService = new DatabaseService()

export default databaseService
