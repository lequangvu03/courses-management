import { Button, Dropdown, DropDownProps, MenuProps } from 'antd'
import classNames from 'classnames/bind'
import icons from '../../assets/icons'
import styles from './style.module.scss'

import { useTranslation } from 'react-i18next'
import { codes } from '../../i18n'

const cx = classNames.bind(styles)

function LanguageSwitcher(props: DropDownProps) {
  const { i18n } = useTranslation()
  const handleChangeLanguage: MenuProps['onClick'] = ({ key }) => {
    i18n.changeLanguage(key)
  }
  const current = i18n.language

  const languages: MenuProps['items'] = [
    {
      label: (
        <span
          className={cx('lang-label', {
            active: current === codes.vi
          })}
        >
          Việt Nam
        </span>
      ),
      key: codes.vi
    },
    {
      label: (
        <span
          className={cx('lang-label', {
            active: current === codes.en
          })}
        >
          English
        </span>
      ),
      key: codes.en
    }
  ]

  return (
    <Dropdown
      {...props}
      menu={{
        items: languages,
        onClick: handleChangeLanguage,
        className: cx('dropdown__item')
      }}
    >
      <Button className={cx('switcher__wrapper')}>
        <img src={current === codes.vi ? icons.viFlag : icons.enFlag} className={cx('flag__image')} />
      </Button>
    </Dropdown>
  )
}

export default LanguageSwitcher
