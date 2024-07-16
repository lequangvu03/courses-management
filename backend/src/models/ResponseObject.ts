export class ResponseObject<T> {
  message: string
  data: T
  constructor({ data, message }: { message: string; data: T }) {
    this.message = message
    this.data = data
  }
}

export class ExpiredTokenError {
  message: string
  name: string

  constructor({ message, name }: { message: string; name: string }) {
    this.message = message
    this.name = name
  }
}
