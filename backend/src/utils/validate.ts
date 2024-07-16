import { NextFunction, Request, Response } from 'express'
import { ValidationChain, validationResult } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'
import { EntityError, ServerError } from '~/models/Errors'

const validate = (validation: RunnableValidationChains<ValidationChain>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await validation.run(req)

    const errors = validationResult(req)

    if (errors.isEmpty()) {
      return next()
    }

    const objectErrors = errors.mapped()
    const entityError = new EntityError({
      data: {}
    })

    // Errors returned are not validation errors: status !== 422

    for (const key in objectErrors) {
      const { msg } = objectErrors[key]
      if (msg instanceof ServerError && msg.status !== HTTP_RESPONSE_STATUS_CODES.UNPROCESSABLE_CONTENT) {
        return next(msg)
      }
      // Validation errors: status == 422
      entityError.data[key] = objectErrors[key]
    }

    next(entityError)
  }
}

export default validate
