import { Flex } from 'antd'
import classNames from 'classnames/bind'
import useSidebarStore from '../../stores/toggle-menu.store'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

type HamburgerProps = {
  className?: string
}

function Hamburger({ className }: HamburgerProps) {
  const { open, toggle } = useSidebarStore()
  return (
    <Flex
      vertical
      gap={6}
      justify='center'
      align='center'
      className={cx('button-hamburger', className, {
        active: open
      })}
      role='button'
      onClick={toggle}
    >
      <span className={cx('hamburger-line')} />
      <span className={cx('hamburger-line')} />
      <span className={cx('hamburger-line')} />
    </Flex>
  )
}

export default Hamburger
