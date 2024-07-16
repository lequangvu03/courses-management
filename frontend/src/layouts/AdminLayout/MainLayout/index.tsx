import { ReactNode } from 'react'
import classNames from 'classnames/bind'

import Sidebar from '../../../components/Sidebar'

import styles from './style.module.scss'
import Header from '../../../components/Header'
const cx = classNames.bind(styles)

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className={cx('layout-wrapper')}>
      <Sidebar className={cx('layout-sidebar')} />
      <main className={cx('layout-main')}>
        <Header />
        <div className={cx('layout-children')}>{children}</div>
      </main>
    </div>
  )
}

export default MainLayout
