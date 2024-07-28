import { NextFunction, Request, Response } from 'express'
import { checkSchema } from 'express-validator'
import { pick } from 'lodash'
import validate from '~/utils/validate'

type FilterKeys<T> = Array<keyof T>
const a: Array<keyof { name: string }> = ['name']

export const filterMiddleware = <T>(filterKeys: FilterKeys<T>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    req.body = pick(req.body, filterKeys)
    next()
  }
}

export const paginationValidator = validate(
  checkSchema(
    {
      limit: {
        isNumeric: true,
        custom: {
          options: async (value) => {
            const num = Number(value)
            if (num > 100 || num < 1) {
              throw new Error('1 <= limit <= 100')
            }
            return true
          }
        }
      },
      page: {
        isNumeric: true,
        custom: {
          options: async (value) => {
            const num = Number(value)
            if (num < 1) {
              throw new Error('page >= 1')
            }
            return true
          }
        }
      },
      search: {
        optional: true,
        isString: true,
        trim: true,
        escape: true
      },
      sortBy: {
        optional: true,
        isIn: {
          options: [['name', 'email', 'date_of_admission', 'created_at']],
          errorMessage: 'Invalid sort field'
        }
      },
      sortOrder: {
        optional: true,
        isIn: {
          options: [['ascend', 'descend']],
          errorMessage: 'Invalid sort order'
        }
      }
    },
    ['query']
  )
)
