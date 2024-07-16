import classNames from 'classnames/bind'
import icons from '../../assets/icons'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

function Header() {
  return (
    <header className={cx('header-wrapper')}>
      <div className={cx('header-inner')}>
        <div className={cx('back-icon')} role='button'>
          <img src={icons.play} />
        </div>
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
