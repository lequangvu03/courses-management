import { Flex } from 'antd'
import classNames from 'classnames/bind'
import styles from './style.module.scss'
import useToggleMenu from '../../hooks/useToggleMenu'

const cx = classNames.bind(styles)

type HamburgerProps = {
  className?: string
}

function Hamburger({ className }: HamburgerProps) {
  const { open, toggle } = useToggleMenu()
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
