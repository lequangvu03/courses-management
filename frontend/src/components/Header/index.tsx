import { Flex } from 'antd'
import classNames from 'classnames/bind'
import icons from '../../assets/icons'
import Hamburger from '../Hamburger'
import LanguageSwitcher from '../LanguageSwitcher'
import styles from './style.module.scss'
import { useTranslation } from 'react-i18next'

const cx = classNames.bind(styles)

function Header() {
  const { t } = useTranslation()
  return (
    <header className={cx('header-wrapper')}>
      <div className={cx('header-inner')}>
        <Flex className={cx('hamburger__wrapper')} align='center' justify='center'>
          <Hamburger className={cx('button__hamburger')} />
        </Flex>
        <div className={cx('header__search-wrapper')}>
          <Flex align='center' gap={16} className={cx('swap__lang-search')}> 
            <LanguageSwitcher trigger={['click']} placement='bottomRight' />
            <div className={cx('search__input')}>
              <input placeholder={t('inputs.search.placeholder')} className={cx('input')} type='text' />
              <button className={cx('icon-search')}>
                <img src={icons.glass} alt='' />
              </button>
            </div>
          </Flex>
          <div role='button'>
            <img src={icons.bell} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
