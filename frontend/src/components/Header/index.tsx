import { Flex } from 'antd'
import classNames from 'classnames/bind'
import { isEmpty, omitBy } from 'lodash'
import { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { createSearchParams, useNavigate } from 'react-router-dom'
import icons from '../../assets/icons'
import useQueryConfig from '../../hooks/useQueryConfig'
import Hamburger from '../Hamburger'
import LanguageSwitcher from '../LanguageSwitcher'
import styles from './style.module.scss'

const cx = classNames.bind(styles)

function Header() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const params = useQueryConfig()

  const onInputSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    navigate({
      pathname: location.pathname,
      search: createSearchParams(
        omitBy(
          {
            ...params,
            search: value
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } as any,
          isEmpty
        )
      ).toString()
    })
  }
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
              <input
                onChange={onInputSearchChange}
                placeholder={t('inputs.search.placeholder')}
                className={cx('input')}
                type='text'
              />
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
