import { OTPVerifyStatus, Role, TokenType, UserVerifyStatus } from '~/constants/enums'
import envs from '~/constants/env-variables'
import { signToken, verifyToken } from '~/utils/jwt'
import databaseService from './database.services'
import { RefreshToken } from '~/models/schemas/refresh-token.model'
import { ObjectId } from 'mongodb'
import { RegisterReqBody, VerifyOTPReqBody } from '~/types/requests/auth.requests'
import User from '~/models/schemas/user.model'
import { hashPassword } from '~/utils/crypto'
import { sendEmail } from './mail.services'
import { Address } from 'nodemailer/lib/mailer'
import { generateEmailOTP } from '~/utils/random'
import ForgotPasswordOTP from '~/models/schemas/forgot-password-otp.model'

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

  async sendEmailVerifyToken({ email, email_verify_token }: { email_verify_token: string; email: string }) {
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
               <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Code</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px 0;
                            border-bottom: 1px solid #dddddd;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #333333;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 18px;
                            color: #666666;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px 0;
                            border-top: 1px solid #dddddd;
                            font-size: 14px;
                            color: #999999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Email Verification</h1>
                        </div>
                        <div class="content">
                            <p>Dear customer,</p>
                            <div class="email-verify-token">
                              <p>Click the link <a href=${verification_link}>Here</a> to confirm your email.</p>
                            </div>
                            <p>This link is valid for 120s.</p>
                        </div>
                        <div class="footer">
                            <p>If you did not request this code, please ignore this email.</p>
                            <p>Thank you,<br>LOUIS</p>
                        </div>
                    </div>
                </body>
                </html>
               `
    })
  }

  async sendEmailOTP({ email, forgot_password_otp }: { email: string; forgot_password_otp: string }) {
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
      message: `<!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Email Verification Code</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background-color: #f4f4f4;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #ffffff;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px 0;
                            border-bottom: 1px solid #dddddd;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                            color: #333333;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content p {
                            font-size: 18px;
                            color: #666666;
                        }
                        .otp {
                            display: inline-block;
                            margin: 20px 0;
                            padding: 10px 20px;
                            font-size: 24px;
                            font-weight: bold;
                            color: #ffffff;
                            background-color: #007BFF;
                            border-radius: 4px;
                            text-decoration: none;
                        }
                        .footer {
                            text-align: center;
                            padding: 10px 0;
                            border-top: 1px solid #dddddd;
                            font-size: 14px;
                            color: #999999;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Email Verification</h1>
                        </div>
                        <div class="content">
                            <p>Dear customer,</p>
                            <p>Your want to reset your password. Please use the following One Time Password (OTP) to complete your verification process:</p>
                            <div class="otp">${forgot_password_otp}</div>
                            <p>This OTP is valid for 120s.</p>
                        </div>
                        <div class="footer">
                            <p>If you did not request this code, please ignore this email.</p>
                            <p>Thank you,<br>LOUIS</p>
                        </div>
                    </div>
                </body>
                </html>
                `
    })
  }

  async requestChangePassword({ user_id, email }: { user_id: string; email: string }) {
    const forgot_password_otp = generateEmailOTP()
    console.log('forgot_password_otp: ', forgot_password_otp)
    await this.sendEmailOTP({
      email,
      forgot_password_otp
    })

    const { insertedId } = await databaseService.forgotPasswordOTP.insertOne(
      new ForgotPasswordOTP({
        otp: forgot_password_otp,
        user_id: new ObjectId(user_id)
      })
    )

    const record = await databaseService.forgotPasswordOTP.findOne({
      _id: insertedId
    })
    return {
      _id: record?._id,
      status: record?.status,
      expires_at: record?.expires_at,
      created_at: record?.created_at
    }
  }

  async verifyOTP({ otp_id }: { otp_id: string }) {
    await databaseService.forgotPasswordOTP.updateOne(
      {
        _id: new ObjectId(otp_id)
      },
      {
        $set: {
          status: OTPVerifyStatus.Verified,
          updated_at: Date.now()
        }
      }
    )
  }

  async resetPassword({ new_password, user_id, otp_id }: { user_id: string; new_password: string; otp_id: string }) {
    await databaseService.users.updateOne(
      {
        _id: new ObjectId(user_id)
      },
      {
        $set: {
          password: hashPassword(new_password),
          updated_at: Date.now()
        }
      }
    )

    await databaseService.forgotPasswordOTP.deleteOne({
      _id: new ObjectId(otp_id)
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

    await this.sendEmailVerifyToken({ email, email_verify_token })
    return {
      message: 'Resend email verification token successfully'
    }
  }
  async getProfile(user_id: string) {
    return await databaseService.users.findOne({
      _id: new ObjectId(user_id)
    })
  }

  async register(payload: RegisterReqBody) {
    const user_id = new ObjectId()
    const { email, password, role } = payload

    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified,
      role
    })

    await this.sendEmailVerifyToken({ email, email_verify_token })

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
    verify,
    role
  }: {
    user_id: string
    refresh_token: string
    verify: UserVerifyStatus
    role: Role
  }) {
    const [tokens] = await Promise.all([
      this.signAccessAndRefreshToken({ user_id, verify, role }),
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
