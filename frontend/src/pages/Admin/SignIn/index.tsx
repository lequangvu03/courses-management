import { Button, Form, message } from 'antd'
import classNames from 'classnames/bind'
import { Link, useNavigate } from 'react-router-dom'
import HeaderBrandTitle from '../../../components/HeaderBrandTitle'
import Input from '../../../components/Input'
import { privateAdminRoutes, publicAdminRoutes } from '../../../config/admin.routes'
import { privateUserRoutes, publicUserRoutes } from '../../../config/user.routes'
import { Role } from '../../../constants/enums'
import { useLoginMutation } from '../../../hooks/data/auth.data'
import useAuth from '../../../hooks/useAuth'
import useQueryParams from '../../../hooks/useQueryParams'
import { handlerError } from '../../../lib/handlers'
import { ILoginFormData } from '../../../types/types'
import styles from './style.module.scss'
import rules from '../../../lib/rules'
import useAdminRoute from '../../../hooks/useDetectRoute'

const cx = classNames.bind(styles)

function SignIn() {
  const navigate = useNavigate()
  const { setIsAuthenticated } = useAuth()
  const { params } = useQueryParams()
  const { isAdmin } = useAdminRoute()
  const [form] = Form.useForm<ILoginFormData>()

  const loginUserMutation = useLoginMutation()

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
              rules={rules.email}
            />

            <Input
              type='password'
              label='Password'
              name='password'
              placeholder='Enter your password'
              rules={rules.password}
            />

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
