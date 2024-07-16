import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'
import { ServerError } from '~/models/Errors'

export const defaultErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ServerError) {
    if (err.renderAsHTML) {
      return res.render('pages/verify-notification', {
        status: HTTP_RESPONSE_STATUS_CODES.UNAUTHORIZED,
        success: false,
        message: `Faied to verify your email`
      })
    }

    return res.status(err.status).json(omit(err, ['status', 'renderAsHTML']))
  }

  Object.getOwnPropertyNames(err).forEach((key) => {
    Object.defineProperty(err, key, {
      enumerable: true
    })
  })

  res.status(HTTP_RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR).json({
    message: err.message,
    data: omit(err, ['stack'])
  })
}
