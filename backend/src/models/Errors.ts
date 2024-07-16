import HTTP_RESPONSE_STATUS_CODES from '~/constants/http-status-codes'

interface IServerError {
  message: string
  status: number
  renderAsHTML?: boolean
}

type TErrors = Record<
  string,
  {
    msg: string
    [key: string]: any
  }
>

export class ServerError implements IServerError {
  message: string
  status: number
  renderAsHTML?: boolean

  constructor({ message, status, renderAsHTML }: ServerError) {
    this.message = message
    this.status = status
    this.renderAsHTML = renderAsHTML
  }
}

export class EntityError extends ServerError {
  data: TErrors
  constructor({ message = 'Validation Error', data }: { message?: string; data: TErrors }) {
    super({ message, status: HTTP_RESPONSE_STATUS_CODES.UNPROCESSABLE_CONTENT })
    this.data = data
  }
}
