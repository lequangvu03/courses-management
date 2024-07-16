/* eslint-disable @typescript-eslint/no-explicit-any */
import { isAxiosUnprocessableEntityError } from './utils'
import { ILoginFormData } from '../types/types'
import { ErrorResponse } from '../types/responses'
import { FormInstance, message } from 'antd'

export const handlerError = <TFormData>({ error, form }: { error: unknown; form?: FormInstance<TFormData> }) => {
  if (isAxiosUnprocessableEntityError<ErrorResponse<ILoginFormData>>(error)) {
    const formErrors = error.response?.data.data
    if (formErrors && form) {
      Object.keys(formErrors).forEach((key) => {
        form.setFields([
          {
            name: key,
            errors: [(formErrors[key as keyof ILoginFormData] as any)?.msg]
          }
        ])
      })
    }
  } else {
    message.error((error && (error as any)?.message) || 'Server error')
  }
}
