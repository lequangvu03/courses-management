import classNames from 'classnames/bind'
import { ReactNode } from 'react'

import Sidebar from '../../../components/Sidebar'

import Header from '../../../components/Header'
import styles from './style.module.scss'
import { ToggleMenuProvider } from '../../../contexts/toggle-menu.context'
const cx = classNames.bind(styles)

type MainLayoutProps = {
  children: ReactNode
}

function MainLayout({ children }: MainLayoutProps) {
  return (
    <ToggleMenuProvider>
      <div className={cx('layout-wrapper')}>
        <Sidebar className={cx('layout-sidebar')} />
        <main className={cx('layout-main')}>
          <Header />
          <div className={cx('layout-children')}>{children}</div>
        </main>
      </div>
    </ToggleMenuProvider>
  )
}

export default MainLayout
