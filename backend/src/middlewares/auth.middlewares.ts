import { checkSchema, ParamSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import envs from '~/constants/env-variables'
import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'
import { ServerError } from '~/models/Errors'
import databaseService from '~/services/database.services'
import userService from '~/services/auth.services'
import { hashPassword } from '~/utils/crypto'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validate'
import { OTPVerifyStatus, Role } from '~/constants/enums'
import { Request } from 'express'
import { ObjectId } from 'mongodb'

const passwordLoginShema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Password is required'
  },
  custom: {
    options: async (value, { req }) => {
      const { role } = req.body

      const user = await databaseService.users.findOne({
        email: req.body.email,
        password: hashPassword(value),
        role: role || Role.User
      })

      if (!user) {
        throw new Error('Email or password is incorrect')
      }
      req.user = user
      return true
    }
  }
}

const passwordRegisterShema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Password is required'
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: 'Password length must be from 6-50 characters'
  },
  isStrongPassword: {
    errorMessage:
      'Password must be at least 6 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol.',
    options: {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1
    }
  }
}

const confirmPasswordShema: ParamSchema = {
  notEmpty: {
    errorMessage: 'Confirm password is required'
  },
  isLength: {
    options: {
      min: 6,
      max: 50
    },
    errorMessage: 'Confirm password length must be from 6-50 characters'
  },
  custom: {
    options: async (confirm_password, { req }) => {
      if (confirm_password !== req.body.password) {
        throw new Error('Confirm password does not match')
      }
      return true
    }
  }
}

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        isEmail: {
          errorMessage: 'Email is invalid'
        },
        trim: true
      },
      password: passwordLoginShema
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email is requierd'
        },
        isEmail: {
          errorMessage: 'Email is invalid'
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const { role } = req.body
            const user = await userService.isEmailInUse(value, role || Role.User)

            if (user) {
              throw new Error('Email already exists')
            }

            return true
          }
        }
      },
      password: passwordRegisterShema,
      confirm_password: confirmPasswordShema,
      role: {
        trim: true,
        custom: {
          options: (value) => {
            if (value && +value !== Role.Admin) {
              throw new ServerError({
                message: 'Permission denied',
                status: HTTP_RESPONSE_STATUS_CODES.FORBIDDEN
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const accessTokenValidator = validate(
  checkSchema(
    {
      Authorization: {
        custom: {
          options: async (value, { req }) => {
            const access_token = (value || '').split('Bearer ')[1]

            try {
              const decoded_access_token = await verifyToken({
                privateKey: envs.accessTokenPrivateKey,
                token: access_token
              })

              req.decoded_access_token = decoded_access_token
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ServerError({
                  message: capitalize(error.message),
                  status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ServerError({
                message: 'Refresh token is required',
                status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
              })
            }

            try {
              const [decoded_refresh_token, refresh_token] = await Promise.all([
                verifyToken({
                  privateKey: envs.refreshTokenPrivateKey,
                  token: value
                }),
                databaseService.refreshTokens.findOne({ token: value })
              ])
              console.log(decoded_refresh_token)
              console.log(refresh_token)

              if (!refresh_token) {
                throw new ServerError({
                  message: 'Refresh token does not exist',
                  status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
                })
              }
              req.decoded_refresh_token = decoded_refresh_token
              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ServerError({
                  message: capitalize(error.message),
                  status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['body']
  )
)

export const emailVerifyTokenValidator = validate(
  checkSchema(
    {
      token: {
        trim: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ServerError({
                message: 'Email verify token is invalid',
                status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED,
                renderAsHTML: true
              })
            }

            try {
              const decoded_email_verify_token = await verifyToken({
                privateKey: envs.emailVerifyTokenPrivateKey,
                token: value
              })

              req.decoded_email_verify_token = decoded_email_verify_token

              return true
            } catch (error) {
              if (error instanceof JsonWebTokenError) {
                throw new ServerError({
                  message: capitalize(error.message),
                  status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED,
                  renderAsHTML: true
                })
              }
              throw error
            }
          }
        }
      }
    },
    ['query']
  )
)

export const requestChangePasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email is required'
        },
        isEmail: {
          errorMessage: 'Email is invalid'
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const { role } = req.body
            const user = await databaseService.users.findOne({
              role: (role && +role) || Role.User,
              email: value
            })

            if (!user) {
              throw new Error('Email does not exist')
            }

            ;(req as Request).user = user
            return true
          }
        }
      }
    },
    ['body']
  )
)

export const verifyOTPValidator = validate(
  checkSchema(
    {
      forgot_password_otp: {
        trim: true,
        isNumeric: true,
        custom: {
          options: async (forgot_password_otp, { req }) => {
            const { otp_id } = req.body

            if (!forgot_password_otp) {
              throw new Error('OTP is required')
            }

            const otp = await databaseService.forgotPasswordOTP.findOne({
              _id: new ObjectId(otp_id as string),
              otp: forgot_password_otp
            })

            if (!otp) {
              throw new Error('OTP is invalid')
            }

            const now = Date.now()
            const { expires_at } = otp

            if (now > expires_at) {
              throw new Error('OTP is expired')
            }

            ;(req as Request).otp = otp
            return true
          }
        }
      }
    },
    ['body']
  )
)
export const resetPasswordValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: 'Email is required'
        },
        isEmail: {
          errorMessage: 'Email is invalid'
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const { role } = req.body

            const user = await databaseService.users.findOne({
              role: (role && +role) || Role.User,
              email: value
            })

            if (!user) {
              throw new Error('Account does not exist')
            }

            ;(req as Request).user = user
            return true
          }
        }
      },
      new_password: passwordRegisterShema,
      confirm_new_password: {
        notEmpty: {
          errorMessage: 'Confirm password is required'
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: 'Confirm password length must be from 6-50 characters'
        },
        custom: {
          options: async (confirm_new_password, { req }) => {
            if (confirm_new_password !== req.body.new_password) {
              throw new Error('Confirm password does not match')
            }
            return true
          }
        }
      },
      otp_id: {
        trim: true,
        notEmpty: {
          errorMessage: 'OTP is invalid'
        },
        custom: {
          options: async (value, { req }) => {
            const otp = await databaseService.forgotPasswordOTP.findOne({
              _id: new ObjectId(value as string)
            })

            if (!otp) {
              throw new Error('OTP is invalid')
            }

            if (otp?.status === OTPVerifyStatus.Unverified) {
              throw new ServerError({
                message: 'Permission denied',
                status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED
              })
            }
            ;(req as Request).otp = otp
            return true
          }
        }
      }
    },
    ['body']
  )
)
