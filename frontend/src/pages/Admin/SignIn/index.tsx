import { Button, Checkbox, Form, message } from 'antd'
import classNames from 'classnames/bind'
import { Link, useNavigate } from 'react-router-dom'
import HeaderBrandTitle from '../../../components/HeaderBrandTitle'
import Input from '../../../components/Input'
import { privateAdminRoutes, publicAdminRoutes } from '../../../config/admin.routes'
import { privateUserRoutes, publicUserRoutes } from '../../../config/user.routes'
import { Role, UserVerifyStatus } from '../../../constants/enums'
import { useLoginMutation } from '../../../hooks/data/auth.data'
import useAdminRoute from '../../../hooks/useDetectRoute'
import { handlerError } from '../../../lib/handlers'
import rules from '../../../lib/rules'
import { ILoginFormData } from '../../../types/types'
import styles from './style.module.scss'

import { useEffect } from 'react'
import {
  getEmailFromCookie,
  getPasswordFromCookie,
  getRememberMeFromCookie,
  removeRememberMeFromCookie,
  setEmailFromCookie,
  setPasswordFromCookie,
  setRememberMeToCookie
} from '../../../lib/utils'
import useAuthStore from '../../../stores/auth.store'

const cx = classNames.bind(styles)

function SignIn() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuthStore()
  const { isAdmin } = useAdminRoute()
  const [form] = Form.useForm<ILoginFormData>()
  const loginUserMutation = useLoginMutation()

  useEffect(() => {
    const role = isAdmin ? Role.Admin : Role.User
    const isRemembered = Boolean(getRememberMeFromCookie(role))

    if (isRemembered) {
      const email = getEmailFromCookie(role)
      const password = getPasswordFromCookie(role)
      form.setFieldsValue({
        email,
        password,
        remember_me: isRemembered
      })
    }
  }, [])

  const handleLogin = async (value: ILoginFormData) => {
    const { email, password, remember_me } = value
    const isRememberMe = Boolean(remember_me)

    try {
      if (isAdmin) {
        const response = await loginUserMutation.mutateAsync({
          email,
          password,
          role: Role.Admin
        })

        const { user } = response.data.data
        setIsAuthenticated(user.verify === UserVerifyStatus.Verify)
        navigate(privateAdminRoutes.dashboard, {
          replace: true
        })

        message.success(response.data.message)
      } else {
        const response = await loginUserMutation.mutateAsync({ email, password })
        const { user } = response.data.data
        setIsAuthenticated(user.verify === UserVerifyStatus.Verify)
        navigate(privateUserRoutes.home, {
          replace: true
        })
        message.success(response.data.message)
      }

      const role = isAdmin ? Role.Admin : Role.User

      if (isRememberMe) {
        setRememberMeToCookie(isRememberMe, role)
        setEmailFromCookie(email, role)
        setPasswordFromCookie(password, role)
      } else {
        removeRememberMeFromCookie(role)
      }
    } catch (error: unknown) {
      handlerError({
        error,
        form
      })
    }
  }

  return (
    <div>
      <div className={cx('signin')}>
        <div className={cx('signin__content')}>
          <header className={cx('signin__header')}>
            <HeaderBrandTitle label='CRUD OPERATIONS' />
            <h3 className={cx('form__title')}>Sign In</h3>
            <div className={cx('form__desc')}>Enter your credentials to access your account</div>
          </header>
          <Form form={form} className={cx('form')} layout='vertical' requiredMark={false} onFinish={handleLogin}>
            <Input name='email' label='Email' placeholder='Enter your email' rules={rules.email} />

            <Input
              type='password'
              label='Password'
              name='password'
              placeholder='Enter your password'
              rules={rules.password}
            />
            <Form.Item layout='horizontal' name='remember_me' valuePropName='checked'>
              <Checkbox id='remember-me'>Remember me</Checkbox>
            </Form.Item>

            <Button
              htmlType='submit'
              loading={loginUserMutation.isPending}
              disabled={loginUserMutation.isPending}
              className={cx('signin__button')}
            >
              <span>Sign in</span>
            </Button>
          </Form>

          <div className={cx('form__footer')}>
            <div>Forgot your password?&nbsp;</div>
            <Link
              to={isAdmin ? publicAdminRoutes.resetPassword : publicUserRoutes.resetPassword}
              className={cx('footer__link')}
            >
              Reset Password
            </Link>
          </div>
          <div className={cx('form__footer')}>
            {!isAdmin && (
              <>
                <div>Don't have a account?&nbsp;</div>
                <Link to={publicUserRoutes.signup} className={cx('footer__link')}>
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
