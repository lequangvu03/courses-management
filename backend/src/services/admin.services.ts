import { Role, TokenType, UserVerifyStatus } from '~/constants/enums'
import envs from '~/constants/env-variables'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import { RefreshToken } from '~/models/schemas/refresh-token.model'
import { ObjectId } from 'mongodb'
import { RegisterReqBody } from '~/types/requests/auth.requests'
import User from '~/models/schemas/user.model'
import { hashPassword } from '~/utils/crypto'
import { sendEmail } from './mail.services'
import { Address } from 'nodemailer/lib/mailer'

class UserService {
  private async signAccessToken({ user_id, verify, role }: { verify: UserVerifyStatus; user_id: string; role?: Role }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.AccesssToken,
        verify,
        role: role || Role.User
      },
      privateKey: envs.accessTokenPrivateKey,
      options: {
        expiresIn: envs.accessTokenExpiresIn
      }
    })
  }

  private async signRefreshToken({
    user_id,
    verify,
    role
  }: {
    verify: UserVerifyStatus
    user_id: string
    role?: Role
  }) {
    return await signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken,
        verify,
        role: role || Role.User
      },
      privateKey: envs.refreshTokenPrivateKey,
      options: {
        expiresIn: envs.refreshTokenExpiresIn
      }
    })
  }

  private async signEmailVerifyToken({
    user_id,
    verify,
    role
  }: {
    verify: UserVerifyStatus
    user_id: string
    role?: Role
  }) {
    return await signToken({
      payload: {
        user_id,
        verify,
        token_type: TokenType.EmailVerifyToken,
        role: role || Role.User
      },
      privateKey: envs.emailVerifyTokenPrivateKey,
      options: {
        expiresIn: +envs.emailVerifyTokenExpiresIn
      }
    })
  }

  private async signAccessAndRefreshToken({
    user_id,
    verify,
    role
  }: {
    verify: UserVerifyStatus
    user_id: string
    role?: Role
  }) {
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken({ user_id, verify, role: role || Role.User }),
      this.signRefreshToken({ user_id, verify, role: role || Role.User })
    ])
    return { access_token, refresh_token }
  }

  async sendEmail({ email, email_verify_token }: { email_verify_token: string; email: string }) {
    const verification_link = `${envs.host}/api/auth/verify-email?token=${email_verify_token}`

    const sender: Address = {
      address: envs.mailAuthUser,
      name: 'LOUIS'
    }

    await sendEmail({
      sender,
      receipients: [
        {
          address: email,
          name: 'User'
        }
      ],
      subject: 'Email verification',
      message: `<h1>Email Confirmation</h1>
               <p>Click the link <a href=${verification_link}>Here</a> to confirm your email.</p>`
    })
  }

  async resendEmailVerifyToken({ email, user_id, role }: { user_id: string; email: string; role?: Role }) {
    const email_verify_token = await this.signEmailVerifyToken({
      user_id,
      verify: UserVerifyStatus.Unverified,
      role: role || Role.User
    })
    console.log('Resend: ', email_verify_token)
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          email_verify_token,
          updated_at: Date.now()
        }
      }
    )

    await this.sendEmail({ email, email_verify_token })
    return {
      message: 'Resend email verification token successfully'
    }
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const { email, password, role } = payload

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role
    })

    await this.sendEmail({ email, email_verify_token })

    await databaseService.users.insertOne(
      new User({
        _id: user_id,
        email,
        password: hashPassword(password),
        email_verify_token,
        role
      })
    )
  }

  async login({ user_id, verify, role }: { verify: UserVerifyStatus; user_id: string; role?: Role }) {
    const { access_token, refresh_token } = await this.signAccessAndRefreshToken({
      user_id,
      verify,
      role
    })

    await databaseService.refreshTokens.insertOne(
      new RefreshToken({
        token: refresh_token,
        user_id: new ObjectId(user_id)
      })
    )

    return {
      access_token,
      refresh_token
    }
  }

  async verifyEmail(user_id: string) {
    const _id = new ObjectId(user_id)

    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        { _id },
        {
          $set: {
            email_verify_token: '',
            updated_at: Date.now(),
            verify: UserVerifyStatus.Verified
          }
        }
      )
    ])

    await databaseService.refreshTokens.insertOne({
      token: tokens.refresh_token,
      user_id: _id
    })

    return tokens
  }

  async isEmailInUse(email: string, role: Role) {
    const user = await databaseService.users.findOne({ email, role })
    if (!user) {
      return false
    }
    return true
  }

  async refreshToken({
    refresh_token,
    user_id,
    verify
  }: {
    user_id: string
    refresh_token: string
    verify: UserVerifyStatus
  }) {
    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify }),
      databaseService.refreshTokens.deleteOne({
        token: refresh_token
      })
    ])

    await databaseService.refreshTokens.insertOne({
      user_id: new ObjectId(user_id),
      token: tokens.refresh_token
    })

    return tokens
  }

  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({
      token: refresh_token
    })
  }
}

const userService = new UserService()

export default userService
