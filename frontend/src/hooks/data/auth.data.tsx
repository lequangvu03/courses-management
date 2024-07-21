import { useMutation } from '@tanstack/react-query'
import authApi from '../../api/auth.api'

const useLoginMutation = () => {
  return useMutation({
    mutationFn: authApi.login
  })
}

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authApi.register
  })
}
const useLogoutMutation = () => {
  return useMutation({
    mutationFn: authApi.logout
  })
}

const useRequestChangePasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.requestChangePassword
  })
}

const useVerifyOTPMutation = () => {
  return useMutation({
    mutationFn: authApi.verifyOTP
  })
}

const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: authApi.resetPassword
  })
}

export {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useRequestChangePasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation
}
