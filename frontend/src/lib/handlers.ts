/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosUnprocessableEntityError } from './utils'
import { ErrorResponse } from '../types/responses'
import { FormInstance, message } from 'antd'

export const handlerError = <TFormData>({ error, form }: { error: unknown; form?: FormInstance<TFormData> }) => {
  if (isAxiosUnprocessableEntityError<ErrorResponse<TFormData>>(error)) {
    const formErrors = error.response?.data.data
    console.log(formErrors)
    if (formErrors && form) {
      Object.keys(formErrors).forEach((key) => {
        form.setFields([
          {
            name: key,
            errors: [(formErrors[key as keyof TFormData] as any)?.msg]
          }
        ])
      })
    }
  } else {
    message.error((error && (error as any)?.message) || 'Server error')
  }
}
