import classNames from 'classnames/bind'
import icons from '../../assets/icons'
import styles from './style.module.scss'
import Hamburger from '../Hamburger'
import { Flex } from 'antd'

const cx = classNames.bind(styles)

function Header() {
  return (
    <header className={cx('header-wrapper')}>
      <div className={cx('header-inner')}>
        <Flex className={cx('hamburger__wrapper')} align='center' justify='center'>
          <Hamburger className={cx('button__hamburger')} />
        </Flex>
        <div className={cx('header__search-wrapper')}>
          <div className={cx('search__input')}>
            <input placeholder='Search...' className={cx('input')} type='text' />
            <button className={cx('icon-search')}>
              <img src={icons.glass} alt='' />
            </button>
          </div>
          <div role='button'>
            <img src={icons.bell} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
