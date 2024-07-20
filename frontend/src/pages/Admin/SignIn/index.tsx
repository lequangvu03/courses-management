import { Button, Checkbox, Flex, Form, message } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import classNames from 'classnames/bind'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import HeaderBrandTitle from '../../../components/HeaderBrandTitle'
import Input from '../../../components/Input'
import { privateAdminRoutes, publicAdminRoutes } from '../../../config/admin.routes'
import { privateUserRoutes, publicUserRoutes } from '../../../config/user.routes'
import { Role } from '../../../constants/enums'
import { useLoginMutation } from '../../../hooks/data/auth.data'
import useAuth from '../../../hooks/useAuth'
import useAdminRoute from '../../../hooks/useDetectRoute'
import useQueryParams from '../../../hooks/useQueryParams'
import { handlerError } from '../../../lib/handlers'
import rules from '../../../lib/rules'
import { getRememberMeFromCookie, setRememberMeToCookie } from '../../../lib/utils'
import { ILoginFormData } from '../../../types/types'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

function SignIn() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const { params } = useQueryParams()
  const { isAdmin } = useAdminRoute()
  const [rememberMe, setRememberMe] = useState<boolean>(getRememberMeFromCookie())
  const [form] = Form.useForm<ILoginFormData & { remember_me: boolean }>()

  const loginUserMutation = useLoginMutation()

  const handleLogin = async (value: ILoginFormData & { remember_me: boolean }) => {
    const { email, password, remember_me } = value
    console.log('Remember me', remember_me)
    try {
      if (isAdmin) {
        const response = await loginUserMutation.mutateAsync({ email, password, role: Role.Admin })
        setIsAuthenticated(true)
        navigate(privateAdminRoutes.dashboard, {
          replace: true
        })
        message.success(response.data.message)
      } else {
        const response = await loginUserMutation.mutateAsync({ email, password })
        setIsAuthenticated(true)
        navigate(privateUserRoutes.home, {
          replace: true
        })
        message.success(response.data.message)
      }
    } catch (error: unknown) {
      handlerError({
        error,
        form
      })
    }
  }
  const handleRememberMe = (e: CheckboxChangeEvent) => {
    const isRememberMe = e.target.checked
    setRememberMeToCookie(isRememberMe)
    setRememberMe(isRememberMe)
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
            <Input
              autoComplete={rememberMe ? 'on' : 'off'}
              name='email'
              label='Email'
              placeholder='Enter your email'
              initialValue={params.get('email')}
              rules={rules.email}
            />

            <Input
              autoComplete={rememberMe ? 'on' : 'off'}
              type='password'
              label='Password'
              name='password'
              placeholder='Enter your password'
              rules={rules.password}
            />
            <Form.Item name='remember_me'>
              <Flex gap={8} align='center'>
                <Checkbox id='remember-me' checked={rememberMe} onChange={handleRememberMe} />
                <label htmlFor='remember-me'>Remember me</label>
              </Flex>
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
