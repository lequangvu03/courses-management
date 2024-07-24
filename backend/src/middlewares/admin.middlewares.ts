import { NextFunction, Request, Response } from 'express'
import { check, checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { capitalize } from 'lodash'
import { ObjectId } from 'mongodb'
import { Role } from '~/constants/enums'
import envs from '~/constants/env-variables'
import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'
import { ServerError } from '~/models/Errors'
import adminService from '~/services/admin.services'
import databaseService from '~/services/database.services'
import { verifyToken } from '~/utils/jwt'
import validate from '~/utils/validate'

export const adminValidator = validate(
  checkSchema(
    {
      access_token: {
        custom: {
          options: async (access_token, { req }) => {
            try {
              const decoded_access_token = await verifyToken({
                privateKey: envs.accessTokenPrivateKey,
                token: access_token
              })

              const { role } = decoded_access_token

              if (role !== Role.Admin) {
                throw new ServerError({
                  message: 'Permission denied',
                  status: HTTP_RESPONSE_STATUS_CODES.FORBIDDEN
                })
              }
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
    ['cookies']
  )
)

export const addStudentValidator = validate(
  checkSchema(
    {
      avatar: {
        trim: true,
        notEmpty: {
          errorMessage: 'Avatar is required'
        },
        isURL: true
      },
      name: {
        trim: true,
        notEmpty: {
          errorMessage: 'Name is required'
        }
      },
      email: {
        trim: true,
        isEmail: {
          errorMessage: 'Email is invalid'
        },
        custom: {
          options: async (value, { req }) => {
            const student = await databaseService.students.findOne({
              email: value
            })

            if (student) {
              throw new ServerError({
                message: 'Email already exists',
                status: HTTP_RESPONSE_STATUS_CODES.FORBIDDEN
              })
            }
          }
        }
      },
      phone: {
        notEmpty: {
          errorMessage: 'Phone number is required'
        }
      },
      enroll_number: {
        notEmpty: {
          errorMessage: 'Enroll Number is required'
        }
      },
      date_of_admission: {
        notEmpty: {
          errorMessage: 'Date of admission is required'
        }
      }
    },
    ['body']
  )
)

export const getStudentByIdValidator = validate(
  checkSchema(
    {
      id: {
        trim: true,
        custom: {
          options: async (id, { req }) => {
            if (!id) {
              throw new ServerError({
                message: 'Student ID is invalid',
                status: HTTP_RESPONSE_STATUS_CODES.BAD_REQUEST
              })
            }

            const student = await adminService.getStudentById(id)

            if (!student) {
              throw new ServerError({
                message: 'Student does not exist',
                status: HTTP_RESPONSE_STATUS_CODES.NOT_FOUND
              })
            }

            ;(req as Request).student = student
          }
        }
      }
    },
    ['params']
  )
)

export const editStudentValidator = validate(
  checkSchema(
    {
      id: {
        isMongoId: true,
        custom: {
          options: async (value, { req }) => {
            if (!value) {
              throw new ServerError({
                message: 'Student ID is not valid',
                status: HTTP_RESPONSE_STATUS_CODES.BAD_REQUEST
              })
            }

            return true
          }
        }
      }
    },
    ['params']
  )
)

export const deleteStudentValidator = validate(
  checkSchema(
    {
      id: {
        trim: true,
        notEmpty: {
          errorMessage: 'Student ID is required'
        }
      }
    },
    ['params']
  )
)
