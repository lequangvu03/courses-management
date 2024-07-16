import { Button, Form, message } from 'antd'
import classNames from 'classnames/bind'
import { NavLink, useLocation } from 'react-router-dom'
import HeaderBrandTitle from '../../components/HeaderBrandTitle'
import Input from '../../components/Input'
import { publicUserRoutes } from '../../config/user.routes'
import { useRegisterMutation } from '../../hooks/data/auth.data'
import { handlerError } from '../../lib/handlers'
import rules from '../../lib/rules'
import { isAdminRoute } from '../../lib/utils'
import { IRegisterFormData } from '../../types/types'
import styles from './style.module.scss'
const cx = classNames.bind(styles)

function SignUp() {
  const location = useLocation()
  const registerMutation = useRegisterMutation()
  const [form] = Form.useForm<IRegisterFormData>()

  const onFinish = async (data: IRegisterFormData) => {
    try {
      const response = await registerMutation.mutateAsync({ ...data })
      message.success(response.data.message)
    } catch (error) {
      handlerError({ error, form })
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onFinishFailed = (errors: any) => {
    console.log(errors)
  }

  return (
    <div>
      <div className={cx('signup')}>
        <div className={cx('signup__content')}>
          <header className={cx('signup__header')}>
            <HeaderBrandTitle label='CRUD OPERATIONS' />
            <h3 className={cx('form__title')}>Sign Up</h3>
            <div className={cx('form__desc')}>Enter your credentials to create your account</div>
          </header>
          <Form
            form={form}
            className={cx('form')}
            requiredMark={false}
            layout='vertical'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Input placeholder='Enter your email' label='Email' name='email' rules={rules.email} />
            <Input placeholder='Enter your password' label='Password' name='password' rules={rules.password} />
            <Input
              placeholder='Enter your confirm password'
              label='Password'
              name='confirm_password'
              dependencies={['password']}
              rules={rules.confirm_password}
            />
            <Button loading={registerMutation.isPending} htmlType='submit' className={cx('signup__button')}>
              Register
            </Button>
          </Form>
          <div className={cx('form__footer')}>
            {!isAdminRoute(location.pathname) && (
              <>
                <div>Already have a account?&nbsp;</div>
                <NavLink to={publicUserRoutes.signin} className={cx('reset-password')}>
                  Sign in
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
