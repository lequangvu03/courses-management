import { SendOutlined } from '@ant-design/icons'
import { Input as AntInput, Button, Flex, Form, message } from 'antd'
import { InputOTP } from 'antd-input-otp'
import classNames from 'classnames/bind'
import { useState } from 'react'

import { Link, useNavigate } from 'react-router-dom'
import HeaderBrandTitle from '../../../components/HeaderBrandTitle'
import Input from '../../../components/Input'
import { publicAdminRoutes } from '../../../config/admin.routes'
import { publicUserRoutes } from '../../../config/user.routes'
import { Role } from '../../../constants/enums'
import {
  useRequestChangePasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation
} from '../../../hooks/data/auth.data'
import useAdminRoute from '../../../hooks/useDetectRoute'
import { handlerError } from '../../../lib/handlers'
import rules from '../../../lib/rules'
import styles from './style.module.scss'
import useCountdown from '../../../hooks/useCountdown'

const cx = classNames.bind(styles)

function ResetPassword() {
  const { isAdmin } = useAdminRoute()
  const [formValues, setFormValues] = useState<{ email: string; otp_id: string; role: Role }>({
    email: '',
    otp_id: '',
    role: isAdmin ? Role.Admin : Role.User
  })
  const navigate = useNavigate()
  const [formSubmitEmail] = Form.useForm()
  const [formSubmitOTP] = Form.useForm()
  const [formSubmitResetPassword] = Form.useForm()
  const requestChangePasswordMutation = useRequestChangePasswordMutation()
  const verifyOTPMutation = useVerifyOTPMutation()
  const resetPasswordMutation = useResetPasswordMutation()
  const [expiresAt, setExpiresAt] = useState<number>(0)
  const { isTimeout, time } = useCountdown(expiresAt)

  const handleRequestChangePassword = async ({ email }: { email: string }) => {
    try {
      const response = await requestChangePasswordMutation.mutateAsync({
        email,
        role: formValues.role
      })

      const { _id, expires_at } = response.data.data
      console.log(expiresAt)
      setExpiresAt(expires_at)
      setFormValues((prev) => ({
        ...prev,
        email,
        otp_id: _id
      }))
      message.success(response.data.message, 3)
    } catch (error) {
      handlerError({ error, form: formSubmitEmail })
    }
  }

  const handleVerifyOTP = async (value: string[]) => {
    const forgot_password_otp = value.join('')
    try {
      const response = await verifyOTPMutation.mutateAsync({ forgot_password_otp, otp_id: formValues.otp_id })
      message.success(response.data.message, 3)
    } catch (error) {
      console.log(error)
      handlerError({
        error,
        form: formSubmitOTP
      })
    }
  }

  const handleResetPassword = async (values: { password: string; confirm_password: string }) => {
    try {
      const response = await resetPasswordMutation.mutateAsync({
        new_password: values.password,
        confirm_new_password: values.confirm_password,
        ...formValues
      })
      message.success(response.data.message, 3)
      navigate(isAdmin ? publicAdminRoutes.signin : publicUserRoutes.signin)
    } catch (error) {
      console.log(error)
      handlerError({ error, form: formSubmitResetPassword })
    }
  }

  return (
    <div>
      <div className={cx('reset-password')}>
        <div className={cx('reset-password__content')}>
          <header className={cx('reset-password__header')}>
            <HeaderBrandTitle label='CRUD OPERATIONS' />
            <h3 className={cx('form__title')}>Reset password</h3>
            <div className={cx('form__desc')}>Enter your credentials to update your account</div>
          </header>
          <Form
            form={formSubmitEmail}
            className={cx('form')}
            requiredMark={false}
            layout='vertical'
            onFinish={handleRequestChangePassword}
          >
            <Form.Item label='Email' name='email' rules={rules.email}>
              <Flex gap={10}>
                <AntInput
                  disabled={verifyOTPMutation.isSuccess}
                  placeholder='Enter your email'
                  className={cx('input__email')}
                />
                <Button
                  icon={(isTimeout || verifyOTPMutation.isSuccess) && <SendOutlined />}
                  disabled={!isTimeout || requestChangePasswordMutation.isPending || verifyOTPMutation.isSuccess}
                  htmlType='submit'
                  className={cx('button__send')}
                >
                  {!isTimeout && !verifyOTPMutation.isSuccess && <span>{time}</span>}
                </Button>
              </Flex>
            </Form.Item>
          </Form>

          {requestChangePasswordMutation.isSuccess && (
            <Form form={formSubmitOTP} hidden={verifyOTPMutation.isSuccess} className={cx('form__otp')}>
              <Form.Item
                name='forgot_password_otp'
                rules={[
                  {
                    required: true,
                    message: 'Please enter your OTP'
                  }
                ]}
              >
                <InputOTP length={6} autoSubmit={handleVerifyOTP} inputType='numeric-symbol' />
              </Form.Item>
            </Form>
          )}

          {verifyOTPMutation.isSuccess && (
            <Form form={formSubmitResetPassword} layout='vertical' requiredMark={false} onFinish={handleResetPassword}>
              <Input
                placeholder='Enter your password'
                type='password'
                label='New password'
                name='password'
                rules={rules.password}
              />
              <Input
                type='password'
                placeholder='Enter your confirm password'
                label='Confirm new password'
                name='confirm_password'
                dependencies={['password']}
                rules={rules.confirm_password}
              />
              <Button
                disabled={resetPasswordMutation.isPending}
                loading={resetPasswordMutation.isPending}
                htmlType='submit'
                className={cx('reset-password__button')}
              >
                Submit
              </Button>
            </Form>
          )}

          <Flex justify='center'>
            <Link to={isAdmin ? publicAdminRoutes.signin : publicUserRoutes.signin} className={cx('back_signin')}>
              Sign in
            </Link>
          </Flex>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
