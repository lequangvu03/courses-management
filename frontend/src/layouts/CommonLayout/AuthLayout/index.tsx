import { ReactNode } from 'react'
import styles from './style.module.scss'
import classNames from 'classnames/bind'
const cx = classNames.bind(styles)

type AuthLayoutProps = {
  children: ReactNode
}

function AuthLayout({ children }: AuthLayoutProps) {
  return <div className={cx('layout-children')}>{children}</div>
}

export default AuthLayout
