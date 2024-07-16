import { useMutation } from '@tanstack/react-query'
import authApi from '../../api/user.api'

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

export { useLoginMutation, useLogoutMutation, useRegisterMutation }
