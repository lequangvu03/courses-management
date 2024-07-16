import { Button, Form, message } from 'antd'
import classNames from 'classnames/bind'
import { NavLink, useNavigate } from 'react-router-dom'
import HeaderBrandTitle from '../../../components/HeaderBrandTitle'
import Input from '../../../components/Input'
import { privateAdminRoutes } from '../../../config/admin.routes'
import { privateUserRoutes, publicUserRoutes } from '../../../config/user.routes'
import { Role } from '../../../constants/enums'
import { useLoginMutation } from '../../../hooks/data/auth.data'
import useAuth from '../../../hooks/useAuth'
import useQueryParams from '../../../hooks/useQueryParams'
import { handlerError } from '../../../lib/handlers'
import { isAdminRoute } from '../../../lib/utils'
import { ILoginFormData } from '../../../types/types'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

function SignIn() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const { location, params } = useQueryParams()
  const [form] = Form.useForm<ILoginFormData>()

  const loginUserMutation = useLoginMutation()
  const isAdmin = isAdminRoute(location.pathname)

  const onFinish = async (value: ILoginFormData) => {
    const { email, password } = value
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

  const onFinishFailed = (errors: unknown) => {
    console.log(errors)
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
          <Form
            autoComplete='on'
            form={form}
            className={cx('form')}
            layout='vertical'
            requiredMark={false}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Input
              name='email'
              label='Email'
              placeholder='Enter your email'
              initialValue={params.get('email')}
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Email is required'
                },
                {
                  pattern: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
                  message: 'Email is invalid'
                }
              ]}
            />

            <Input
              type='password'
              label='Password'
              name='password'
              placeholder='Enter your password'
              rules={[
                {
                  required: true,
                  whitespace: true,
                  message: 'Password is required'
                },
                {
                  min: 6,
                  message: 'Password must be at least 6 letters'
                },
                {
                  max: 50,
                  message: "The password's length cannot exceed 50 letters"
                }
              ]}
            />

            <Button
              htmlType='submit'
              loading={loginUserMutation.isPending}
              disabled={loginUserMutation.isPending}
              className={cx('signin__button')}
            >
              {isAdminRoute(location.pathname) ? <span>Sign in</span> : <span>Sign up</span>}
            </Button>
          </Form>
          <div className={cx('form__footer')}>
            <div>Forgot your password?&nbsp;</div>
            <a href='#' className={cx('reset-password')}>
              Reset Password
            </a>
          </div>
          <div className={cx('form__footer')}>
            {!isAdminRoute(location.pathname) && (
              <>
                <div>Don't have a account?&nbsp;</div>
                <NavLink to={publicUserRoutes.signup} className={cx('reset-password')}>
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
